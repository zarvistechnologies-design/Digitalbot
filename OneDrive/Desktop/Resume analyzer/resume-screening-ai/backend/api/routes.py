"""
API Routes
FastAPI endpoints for resume screening
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
import time
import uuid
from pathlib import Path
import logging

from backend.schemas.resume import ProcessResponse, CandidateResponse
from backend.schemas.response import HealthResponse, SkillExtractionResponse
from backend.core.config import settings
from backend.core.ml_engine_enhanced import get_enhanced_ml_engine
from backend.utils.parser import ResumeParser
from backend.utils.skill_extractor import get_skill_extractor
from backend.utils.contact_extractor import ContactExtractor
from backend.utils.resume_validator import get_resume_validator

logger = logging.getLogger(__name__)

# Create router
router = APIRouter()

# Initialize ML engine at startup - using custom trained model
ml_engine = get_enhanced_ml_engine(use_custom=True)
skill_extractor = get_skill_extractor()
parser = ResumeParser()
resume_validator = get_resume_validator()  # NLP-powered validator


@router.post("/process", response_model=ProcessResponse)
async def process_resumes(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...)
):
    """
    Process uploaded resumes against job description
    
    Args:
        resumes: List of resume files (PDF/DOCX)
        job_description: Job description text
        
    Returns:
        ProcessResponse with ranked candidates
    """
    start_time = time.time()
    
    try:
        # Validate inputs
        if not resumes:
            raise HTTPException(status_code=400, detail="No resumes uploaded")
        
        if len(job_description) < 50:
            raise HTTPException(status_code=400, detail="Job description too short")
        
        if len(resumes) > settings.MAX_FILES:
            raise HTTPException(
                status_code=400, 
                detail=f"Maximum {settings.MAX_FILES} files allowed"
            )
        
        # Extract skills from job description
        required_skills = skill_extractor.extract_skills(job_description)
        logger.info(f"Found {len(required_skills)} required skills in job description")
        
        results = []
        
        logger.info(f"Starting to process {len(resumes)} resumes")
        
        # Process each resume
        for idx, resume_file in enumerate(resumes, 1):
            try:
                logger.info(f"Processing resume {idx}/{len(resumes)}: {resume_file.filename}")
                
                # Validate file type
                file_ext = Path(resume_file.filename).suffix.lower()
                if file_ext not in settings.ALLOWED_EXTENSIONS:
                    logger.warning(f"Skipping unsupported file: {resume_file.filename}")
                    continue
                
                # Save uploaded file temporarily
                temp_file_path = settings.UPLOADS_DIR / f"{uuid.uuid4()}{file_ext}"
                with open(temp_file_path, "wb") as f:
                    content = await resume_file.read()
                    f.write(content)
                
                logger.info(f"Saved temp file: {temp_file_path}")
                
                # Parse resume
                resume_text = parser.parse_resume(str(temp_file_path))
                if not resume_text:
                    logger.warning(f"Could not extract text from {resume_file.filename}")
                    logger.warning(f"This might be a scanned/image-based PDF. Consider using OCR or text-based PDFs.")
                    temp_file_path.unlink()
                    continue
                
                logger.info(f"Extracted {len(resume_text)} characters from {resume_file.filename}")
                
                # Clean text
                resume_text = parser.clean_text(resume_text)
                
                # NLP VALIDATION: Check if document is actually a resume
                is_resume, validation_details = resume_validator.validate_resume(resume_text)
                
                if not is_resume:
                    validation_msg = resume_validator.get_validation_message(validation_details)
                    logger.warning(f"❌ {resume_file.filename} rejected: {validation_msg}")
                    logger.warning(f"Validation details: {validation_details}")
                    temp_file_path.unlink()
                    # Skip this file and continue with next
                    continue
                
                logger.info(f"✓ {resume_file.filename} validated as resume (confidence: {validation_details['confidence']}%)")
                logger.info(f"Sections found: {', '.join(validation_details['sections_found'])}")
                
                # Extract contact information
                contact_info = ContactExtractor.extract_all_contact_info(resume_text)
                
                # ENHANCED: Extract experience using advanced extractor
                from backend.utils.experience_education_extractor import extract_experience_and_education
                exp_edu_data = extract_experience_and_education(resume_text)
                
                # Use the better experience extraction
                experience_years = exp_edu_data.get('years_of_experience', 0)
                if experience_years == 0:
                    # Fallback to old method
                    experience_years = contact_info.get('experience_years', 0)
                
                seniority_level = exp_edu_data.get('seniority_level', 'Entry Level')
                education_data = exp_edu_data.get('education', contact_info.get('education', []))
                
                # Convert education dicts to strings for schema compatibility
                if education_data and isinstance(education_data[0], dict):
                    education_list = [
                        f"{edu.get('degree', '')} in {edu.get('specialization', 'Unknown')}"
                        if edu.get('specialization')
                        else edu.get('degree', 'Unknown')
                        for edu in education_data
                    ]
                else:
                    education_list = education_data
                
                logger.info(f"Experience: {experience_years} years ({seniority_level})")
                logger.info(f"Education: {len(education_list)} degrees found")
                
                # Extract skills from resume
                resume_skills = skill_extractor.extract_skills(resume_text)
                
                # Compute skill match score with details
                skill_match_score, matched_skills, missing_skills = skill_extractor.compute_skill_match_score(
                    resume_skills, list(required_skills)
                )
                
                # Calculate semantic similarity
                semantic_score = ml_engine.compute_semantic_similarity(
                    resume_text, job_description
                )
                
                # ENHANCED: Detect job seniority level from JD
                jd_lower = job_description.lower()
                required_seniority = 'Entry Level'
                if 'senior' in jd_lower or 'lead' in jd_lower or 'principal' in jd_lower:
                    required_seniority = 'Senior'
                elif 'mid-level' in jd_lower or 'intermediate' in jd_lower:
                    required_seniority = 'Mid-Level'
                elif 'junior' in jd_lower:
                    required_seniority = 'Junior'
                
                # Extract required years from JD
                import re
                required_years_match = re.search(r'(\d+)\+?\s*years?\s+(?:of\s+)?experience', jd_lower)
                required_years = float(required_years_match.group(1)) if required_years_match else 3.0
                
                logger.info(f"Job requires: {required_years} years ({required_seniority})")
                
                experience_score = ml_engine.compute_experience_score(
                    experience_years, required_years
                )
                
                # SENIORITY PENALTY: REDUCED to be more like ChatGPT (8% per level instead of 20%)
                seniority_hierarchy = {'Entry Level': 0, 'Junior': 1, 'Mid-Level': 2, 'Senior': 3, 'Lead/Principal': 4}
                candidate_level = seniority_hierarchy.get(seniority_level, 0)
                required_level = seniority_hierarchy.get(required_seniority, 0)
                
                if candidate_level < required_level:
                    level_gap = required_level - candidate_level
                    penalty = level_gap * 8  # REDUCED: 8% penalty per level (was 20%)
                    experience_score = max(0, experience_score - penalty)
                    logger.warning(f"Seniority gap: {seniority_level} → {required_seniority}. Penalty: -{penalty}%")
                elif candidate_level > required_level:
                    # Over-qualified: small bonus
                    bonus = (candidate_level - required_level) * 3
                    experience_score = min(100, experience_score + bonus)
                    logger.info(f"Over-qualified: {seniority_level} → {required_seniority}. Bonus: +{bonus}%")
                
                education_score = ml_engine.compute_education_score(
                    education_list
                )
                
                final_score = ml_engine.calculate_final_score(
                    semantic_score,
                    skill_match_score,
                    experience_score,
                    education_score
                )
                
                # Detailed logging for debugging
                logger.info(f"=== SCORES FOR {resume_file.filename} ===")
                logger.info(f"Semantic: {semantic_score:.1f}% (weight: 20%)")
                logger.info(f"Skills: {skill_match_score:.1f}% (weight: 40%)")
                logger.info(f"Experience: {experience_score:.1f}% (weight: 30%)")
                logger.info(f"Education: {education_score:.1f}% (weight: 10%)")
                logger.info(f"FINAL SCORE: {final_score:.1f}%")
                logger.info(f"Matched skills: {len(matched_skills)}, Missing: {len(missing_skills)}")
                
                # Create result
                candidate_result = {
                    'name': contact_info.get('name', 'Unknown'),
                    'email': contact_info.get('email'),
                    'phone': contact_info.get('phone'),
                    'filename': resume_file.filename,
                    'final_score': final_score,
                    'semantic_score': semantic_score,
                    'skill_match_score': skill_match_score,
                    'experience_score': experience_score,
                    'education_score': education_score,
                    'experience_years': experience_years,
                    'seniority_level': seniority_level,
                    'education': education_list,
                    'skills_found': matched_skills,
                    'missing_skills': missing_skills
                }
                
                results.append(candidate_result)
                
                # Clean up temp file
                temp_file_path.unlink()
                
                logger.info(f"Processed {resume_file.filename}: Score = {final_score}")
                
            except Exception as e:
                logger.error(f"Error processing {resume_file.filename}: {e}")
                continue
        
        # Rank candidates
        ranked_results = ml_engine.rank_candidates(results)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        return ProcessResponse(
            success=True,
            message=f"Successfully processed {len(ranked_results)} resumes",
            total_candidates=len(ranked_results),
            results=ranked_results,
            processing_time=round(processing_time, 2)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in process_resumes: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        service="resume-screening-ai",
        version="1.0.0"
    )


@router.post("/extract-skills", response_model=SkillExtractionResponse)
async def extract_skills(text: str = Form(...)):
    """
    Extract skills from text
    
    Args:
        text: Text to extract skills from
        
    Returns:
        List of extracted skills
    """
    try:
        skills = skill_extractor.extract_skills(text)
        return SkillExtractionResponse(
            skills=skills,
            total_skills=len(skills)
        )
    except Exception as e:
        logger.error(f"Error extracting skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/skills/all")
async def get_all_skills():
    """Get all skills in database"""
    try:
        skills = skill_extractor.get_all_skills()
        return {
            "skills": skills,
            "total": len(skills)
        }
    except Exception as e:
        logger.error(f"Error getting skills: {e}")
        raise HTTPException(status_code=500, detail=str(e))
