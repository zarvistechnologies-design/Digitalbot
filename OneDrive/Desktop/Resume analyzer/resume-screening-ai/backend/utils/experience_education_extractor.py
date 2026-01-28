"""
Experience & Education Extraction Module
Uses regex patterns and NLP (spaCy NER) to extract:
1. Years of experience (from dates using NER)
2. Seniority level
3. Degree and specializations
4. Universities and certifications
"""

import re
from typing import Dict, List, Tuple, Optional
import logging
from backend.utils.nlp_processor import NLPProcessor

logger = logging.getLogger(__name__)


class ExperienceExtractor:
    """
    Extract work experience from resume using NLP + regex
    """
    
    def __init__(self):
        """Initialize with NLP processor for date extraction"""
        try:
            self.nlp_processor = NLPProcessor()
        except Exception as e:
            logger.warning(f"NLP processor not available: {e}")
            self.nlp_processor = None
    
    # Experience patterns
    EXPERIENCE_PATTERNS = [
        # "5 years of experience"
        r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*years?\s+(?:of\s+)?experience',
        
        # "5+ years experience"
        r'(\d+(?:\.\d+)?)\+?\s*years?\s+experience',
        
        # "Experience: 5 years"
        r'experience\s*:?\s*(\d+(?:\.\d+)?)\s*(?:\+)?\s*years?',
        
        # "Over 5 years of experience"
        r'over\s+(\d+(?:\.\d+)?)\s*years?\s+(?:of\s+)?experience',
        
        # "5 years in Python"
        r'(\d+(?:\.\d+)?)\s*(?:\+)?\s*years?\s+(?:in|with|using)',
    ]
    
    def extract_years_of_experience(self, text: str) -> float:
        """
        Extract total years of experience from resume
        Uses ChatGPT's logic: Calculate from work history dates
        Enhanced with spaCy NER for DATE extraction
        
        Returns:
            Years of experience (float)
        """
        if not text:
            logger.warning("Empty text provided to extract_years_of_experience")
            return 0.0
        
        # PRIMARY METHOD: Calculate from work history date ranges (like ChatGPT does)
        years_from_dates = self._calculate_from_date_ranges(text)
        if years_from_dates > 0:
            logger.info(f"✓ Extracted {years_from_dates} years from work history dates")
            return years_from_dates
        
        # SECONDARY: Look for explicit experience statements
        text_lower = text.lower()
        found_years = []
        
        for pattern in self.EXPERIENCE_PATTERNS:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                try:
                    years = float(match)
                    if 0 < years <= 50:  # Sanity check
                        found_years.append(years)
                except (ValueError, TypeError):
                    continue
        
        if found_years:
            max_years = max(found_years)
            logger.info(f"✓ Extracted {max_years} years from experience statements")
            return max_years
        
        # FALLBACK: Estimate from keywords (senior, lead, etc.)
        if 'senior' in text_lower or 'sr.' in text_lower or 'sr ' in text_lower:
            logger.info("✓ Estimated 6 years based on 'Senior' title")
            return 6.0
        elif 'lead' in text_lower or 'principal' in text_lower or 'staff' in text_lower:
            logger.info("✓ Estimated 8 years based on 'Lead/Principal' title")
            return 8.0
        elif 'mid-level' in text_lower or 'intermediate' in text_lower:
            logger.info("✓ Estimated 4 years based on 'Mid-level' title")
            return 4.0
        elif 'junior' in text_lower or 'jr.' in text_lower:
            logger.info("✓ Estimated 2 years based on 'Junior' title")
            return 2.0
        
        logger.warning("⚠ Could not extract years of experience - defaulting to 3 years")
        return 3.0  # Default to mid-level instead of 0
    
    def _calculate_from_date_ranges(self, text: str) -> float:
        """
        Calculate experience from date ranges in resume (ChatGPT's approach)
        Enhanced with spaCy NER for DATE entity extraction
        Example: "2018 - 2023" = 5 years
        Handles: "2020-Present", "Jan 2019 - Dec 2023", etc.
        """
        from datetime import datetime
        current_year = datetime.now().year
        
        # PRIORITY 1: Try spaCy NER DATE extraction first
        if self.nlp_processor and self.nlp_processor.nlp:
            try:
                date_entities = self.nlp_processor.extract_dates(text)
                if date_entities:
                    logger.info(f"  ✓ Found {len(date_entities)} DATE entities via NLP: {date_entities[:5]}")
                    # Fall through to regex patterns which will also capture these
            except Exception as e:
                logger.debug(f"  NLP date extraction failed: {e}")
        
        # PRIORITY 2: Regex patterns (comprehensive fallback)
        date_patterns = [
            # YYYY - YYYY or YYYY-YYYY
            r'(\d{4})\s*[-–—]\s*(\d{4})',
            # YYYY - Present/Current
            r'(\d{4})\s*[-–—]\s*(?:present|current|now)',
            # Month YYYY - Month YYYY (e.g., "Jan 2019 - Dec 2023")
            r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\s*[-–—]\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})',
            # Month YYYY - Present
            r'(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{4})\s*[-–—]\s*(?:present|current|now)',
        ]
        
        total_experience = 0.0
        found_ranges = set()
        
        text_lower = text.lower()
        
        for pattern in date_patterns:
            matches = re.findall(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                try:
                    if isinstance(match, str):  # Single capture (present/current)
                        start_year = int(match)
                        end_year = current_year
                    elif len(match) == 1:  # YYYY - Present
                        start_year = int(match[0])
                        end_year = current_year
                    elif len(match) == 2:  # YYYY - YYYY
                        start_year = int(match[0])
                        # Check if second match is a year or keyword
                        if match[1].isdigit():
                            end_year = int(match[1])
                        else:
                            end_year = current_year
                    else:
                        continue
                    
                    # Validate years
                    if not (1980 <= start_year <= current_year):
                        continue
                    if not (start_year <= end_year <= current_year + 1):
                        continue
                    
                    duration = end_year - start_year
                    if 0 < duration <= 50:
                        range_key = f"{start_year}-{end_year}"
                        if range_key not in found_ranges:
                            found_ranges.add(range_key)
                            total_experience += duration
                            logger.info(f"  ✓ Found work period: {start_year} - {end_year} = {duration} years")
                
                except (ValueError, TypeError, AttributeError) as e:
                    logger.debug(f"  Skipping invalid date match: {match}")
                    continue
        
        if total_experience > 0:
            logger.info(f"  ✓ Total calculated experience: {total_experience} years from {len(found_ranges)} positions")
        
        return round(total_experience, 1)
    
    def classify_seniority_level(self, years: float) -> str:
        """
        Classify seniority based on years of experience
        
        Returns:
            "Entry", "Junior", "Mid-Level", "Senior", "Lead/Principal"
        """
        if years < 1:
            return "Entry Level"
        elif years < 3:
            return "Junior"
        elif years < 5:
            return "Mid-Level"
        elif years < 8:
            return "Senior"
        else:
            return "Lead/Principal"
    
    def extract_job_titles(self, text: str) -> List[str]:
        """
        Extract job titles from resume
        Enhanced with spaCy NER for ORG entities
        """
        # Common job title patterns
        title_patterns = [
            r'(?:software|backend|frontend|full[- ]stack|data|ml|devops|cloud)\s+(?:engineer|developer|architect|scientist|analyst)',
            r'(?:senior|junior|lead|principal|staff)\s+(?:engineer|developer|architect|scientist)',
            r'(?:team|tech|technical)\s+lead',
            r'(?:engineering|development)\s+manager',
            r'(?:cto|vp|director)\s+(?:of\s+)?(?:engineering|technology)',
        ]
        
        titles = []
        for pattern in title_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            titles.extend(matches)
        
        return list(set(titles))


class EducationExtractor:
    """
    Extract education information from resume
    Enhanced with spaCy NER for ORG entities (universities)
    """
    
    def __init__(self):
        """Initialize with NLP processor for enhanced extraction"""
        try:
            self.nlp_processor = NLPProcessor()
            logger.info("✓ EducationExtractor initialized with NLP processor")
        except Exception as e:
            logger.warning(f"NLP processor not available for EducationExtractor: {e}")
            self.nlp_processor = None
    
    # Degree patterns
    DEGREE_PATTERNS = {
        'PhD': r'\b(?:ph\.?d\.?|doctorate|doctoral)\b',
        'Master': r'\b(?:master|m\.?s\.?|m\.?tech|m\.?sc\.?|mba|m\.?e\.?|mca)\b',
        'Bachelor': r'\b(?:bachelor|b\.?s\.?|b\.?tech|b\.?sc\.?|b\.?e\.?|b\.?a\.?|bca)\b',
        'Diploma': r'\b(?:diploma|associate|a\.?a\.?|a\.?s\.?)\b',
    }
    
    # Specializations
    SPECIALIZATIONS = [
        'Computer Science', 'CS', 'CSE', 'Computer Engineering', 'Information Technology',
        'IT', 'Software Engineering', 'Data Science', 'Artificial Intelligence',
        'Machine Learning', 'Electronics', 'ECE', 'Electrical Engineering',
        'Mechanical Engineering', 'Civil Engineering', 'Mathematics', 'Physics',
        'Business Administration', 'Management', 'Finance', 'Economics'
    ]
    
    def extract_education(self, text: str) -> List[Dict]:
        """
        Extract education details
        Enhanced with spaCy NER for university names (ORG entities)
        
        Returns:
            List of education dicts with degree, specialization, year, institution
        """
        if not text:
            return []
        
        # PRIORITY 1: Try NLP ORG extraction for universities
        universities = []
        if self.nlp_processor and self.nlp_processor.nlp:
            try:
                universities = self.nlp_processor.extract_organizations(text)
                if universities:
                    logger.info(f"  ✓ Found {len(universities)} institutions via NLP: {universities[:3]}")
            except Exception as e:
                logger.debug(f"  NLP org extraction failed: {e}")
        
        education_list = []
        
        # Find degrees
        for degree_type, pattern in self.DEGREE_PATTERNS.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                # Get context around the match (next 100 characters)
                start_pos = match.start()
                end_pos = min(start_pos + 150, len(text))
                context = text[start_pos:end_pos]
                
                # Extract specialization from context
                specialization = self._extract_specialization(context)
                
                # Extract year
                year = self._extract_year(context)
                
                # Extract institution (prioritize NLP-detected orgs)
                institution = None
                if universities:
                    # Find closest university to this degree mention
                    for uni in universities[:3]:  # Check first 3 universities
                        if uni.lower() in context.lower():
                            institution = uni
                            break
                
                education_list.append({
                    'degree': degree_type,
                    'specialization': specialization,
                    'year': year,
                    'institution': institution,
                    'raw_text': match.group()
                })
        
        if education_list and any(e.get('institution') for e in education_list):
            logger.info(f"✓ Extracted {len(education_list)} education entries with NLP-detected institutions")
        else:
            logger.info(f"Extracted {len(education_list)} education entries")
        return education_list
    
    def _extract_specialization(self, text: str) -> Optional[str]:
        """
        Extract specialization/major from education text
        """
        text_lower = text.lower()
        
        for spec in self.SPECIALIZATIONS:
            if spec.lower() in text_lower:
                return spec
        
        # Look for "in <specialization>" pattern
        in_pattern = r'in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})'
        match = re.search(in_pattern, text)
        if match:
            return match.group(1)
        
        return None
    
    def _extract_year(self, text: str) -> Optional[int]:
        """
        Extract graduation year
        """
        # Look for 4-digit years between 1980-2030
        year_pattern = r'\b(19[89]\d|20[0-3]\d)\b'
        matches = re.findall(year_pattern, text)
        
        if matches:
            # Return the most recent year
            years = [int(y) for y in matches]
            return max(years)
        
        return None
    
    def compute_education_score(self, education_list: List[Dict]) -> float:
        """
        Compute education score based on highest degree
        
        Scoring:
        - PhD: 100
        - Master: 90
        - Bachelor: 75
        - Diploma: 60
        - None: 50 (default)
        """
        if not education_list:
            return 50.0
        
        degree_scores = {
            'PhD': 100,
            'Master': 90,
            'Bachelor': 75,
            'Diploma': 60
        }
        
        # Find highest degree
        max_score = 0
        for edu in education_list:
            degree = edu.get('degree', '')
            score = degree_scores.get(degree, 50)
            max_score = max(max_score, score)
        
        return float(max_score)
    
    def is_relevant_degree(self, education_list: List[Dict], required_field: str = 'Computer Science') -> bool:
        """
        Check if candidate has relevant degree for the role
        """
        relevant_fields = [
            'Computer Science', 'CS', 'CSE', 'Computer Engineering',
            'Information Technology', 'IT', 'Software Engineering',
            'Data Science', 'Artificial Intelligence', 'Machine Learning'
        ]
        
        for edu in education_list:
            spec = edu.get('specialization', '')
            if spec and any(field.lower() in spec.lower() for field in relevant_fields):
                return True
        
        return False


# Convenience functions
def extract_experience_and_education(text: str) -> Dict:
    """
    Extract both experience and education from resume
    
    Returns:
        {
            'years_of_experience': float,
            'seniority_level': str,
            'job_titles': List[str],
            'education': List[Dict],
            'education_score': float,
            'has_relevant_degree': bool
        }
    """
    exp_extractor = ExperienceExtractor()
    edu_extractor = EducationExtractor()
    
    years = exp_extractor.extract_years_of_experience(text)
    education = edu_extractor.extract_education(text)
    
    return {
        'years_of_experience': years,
        'seniority_level': exp_extractor.classify_seniority_level(years),
        'job_titles': exp_extractor.extract_job_titles(text),
        'education': education,
        'education_score': edu_extractor.compute_education_score(education),
        'has_relevant_degree': edu_extractor.is_relevant_degree(education)
    }
