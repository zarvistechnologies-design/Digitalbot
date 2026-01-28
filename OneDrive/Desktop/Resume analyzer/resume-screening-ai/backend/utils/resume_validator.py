"""
NLP-Powered Resume Validator
Uses spaCy NER, keyword detection, and structure analysis to validate if a document is a resume
"""

import re
from typing import Dict, List, Tuple
import logging
from backend.utils.nlp_processor import NLPProcessor

logger = logging.getLogger(__name__)


class ResumeValidator:
    """
    Intelligent resume validation using NLP
    Checks if document is actually a resume before processing
    """
    
    def __init__(self):
        self.nlp_processor = NLPProcessor()
        
        # Resume section keywords (must find at least 2-3 of these)
        self.section_keywords = {
            'experience': ['experience', 'work history', 'employment', 'professional experience', 
                          'work experience', 'career history', 'positions held'],
            'education': ['education', 'academic', 'qualifications', 'degrees', 'university', 
                         'college', 'school', 'certifications'],
            'skills': ['skills', 'technical skills', 'expertise', 'competencies', 
                      'technologies', 'proficiencies', 'capabilities'],
            'summary': ['summary', 'objective', 'profile', 'about me', 'professional summary'],
            'projects': ['projects', 'portfolio', 'work samples'],
            'contact': ['contact', 'email', 'phone', 'address', 'location']
        }
        
        # Resume-specific keywords (good indicators)
        self.resume_indicators = [
            'resume', 'curriculum vitae', 'cv', 'responsible for', 'managed', 
            'developed', 'led', 'collaborated', 'achieved', 'implemented',
            'years of experience', 'bachelor', 'master', 'phd', 'degree',
            'certification', 'proficient', 'expert', 'skilled'
        ]
        
        # Non-resume indicators (bad signs)
        self.non_resume_indicators = [
            'recipe', 'ingredients', 'directions', 'serves', 'cooking',
            'invoice', 'bill', 'payment', 'due date', 'total amount',
            'article', 'chapter', 'abstract', 'conclusion', 'references',
            'terms and conditions', 'privacy policy', 'agreement',
            'product description', 'user manual', 'instruction',
            'once upon a time', 'the end', 'story'
        ]
    
    def validate_resume(self, text: str) -> Tuple[bool, Dict]:
        """
        Validate if document is a resume using multiple NLP checks
        
        Returns:
            (is_valid, validation_details)
            
        validation_details = {
            'is_resume': bool,
            'confidence': float (0-100),
            'reasons': List[str],
            'sections_found': List[str],
            'has_contact': bool,
            'has_experience': bool,
            'has_education': bool,
            'entity_count': int,
            'word_count': int
        }
        """
        if not text or len(text.strip()) < 100:
            return False, {
                'is_resume': False,
                'confidence': 0,
                'reasons': ['Document too short (< 100 characters)'],
                'sections_found': [],
                'has_contact': False,
                'has_experience': False,
                'has_education': False,
                'entity_count': 0,
                'word_count': 0
            }
        
        text_lower = text.lower()
        word_count = len(text.split())
        
        # Initialize validation details
        validation = {
            'is_resume': False,
            'confidence': 0,
            'reasons': [],
            'sections_found': [],
            'has_contact': False,
            'has_experience': False,
            'has_education': False,
            'entity_count': 0,
            'word_count': word_count
        }
        
        confidence_score = 0
        
        # 1. CHECK DOCUMENT LENGTH (resumes are typically 300-3000 words)
        if word_count < 200:
            validation['reasons'].append(f'Too short ({word_count} words, expected 200+)')
            confidence_score -= 20
        elif word_count > 5000:
            validation['reasons'].append(f'Too long ({word_count} words, expected < 5000)')
            confidence_score -= 10
        else:
            validation['reasons'].append(f'Good length ({word_count} words)')
            confidence_score += 15
        
        # 2. CHECK FOR RESUME SECTIONS
        sections_found = []
        for section_name, keywords in self.section_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                sections_found.append(section_name)
        
        validation['sections_found'] = sections_found
        section_count = len(sections_found)
        
        if section_count >= 3:
            validation['reasons'].append(f'Found {section_count} resume sections: {", ".join(sections_found)}')
            confidence_score += 30
        elif section_count >= 2:
            validation['reasons'].append(f'Found {section_count} resume sections')
            confidence_score += 15
        else:
            validation['reasons'].append(f'Only {section_count} resume section(s) found')
            confidence_score -= 20
        
        # 3. CHECK FOR CONTACT INFORMATION
        has_email = bool(re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text))
        has_phone = bool(re.search(r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text))
        
        validation['has_contact'] = has_email or has_phone
        
        if has_email and has_phone:
            validation['reasons'].append('Found email and phone (strong indicator)')
            confidence_score += 20
        elif has_email or has_phone:
            validation['reasons'].append('Found contact info')
            confidence_score += 10
        else:
            validation['reasons'].append('No contact info found')
            confidence_score -= 15
        
        # 4. CHECK FOR EXPERIENCE INDICATORS
        experience_patterns = [
            r'\d{4}\s*[-–]\s*\d{4}',  # Date ranges like 2018-2023
            r'\d{4}\s*[-–]\s*(?:present|current)',  # 2020-Present
            r'\d+\+?\s*years?\s+(?:of\s+)?experience',  # X years of experience
        ]
        
        has_experience = any(re.search(pattern, text_lower) for pattern in experience_patterns)
        validation['has_experience'] = has_experience
        
        if has_experience:
            validation['reasons'].append('Found work experience/dates')
            confidence_score += 20
        else:
            validation['reasons'].append('No work experience dates found')
            confidence_score -= 10
        
        # 5. CHECK FOR EDUCATION INDICATORS
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'b.tech', 'm.tech', 'b.sc', 'm.sc']
        has_education = any(keyword in text_lower for keyword in education_keywords)
        validation['has_education'] = has_education
        
        if has_education:
            validation['reasons'].append('Found education information')
            confidence_score += 15
        
        # 6. NLP ENTITY EXTRACTION (PERSON, ORG, DATE)
        try:
            entities = self.nlp_processor.extract_named_entities(text[:2000])  # Check first 2000 chars
            
            person_count = len(entities.get('PERSON', []))
            org_count = len(entities.get('ORG', []))
            date_count = len(entities.get('DATE', []))
            
            validation['entity_count'] = person_count + org_count + date_count
            
            # Resume should have: 1-2 person names (candidate), multiple orgs (companies), multiple dates
            if person_count >= 1 and org_count >= 2 and date_count >= 2:
                validation['reasons'].append(f'Strong NER signals (Person:{person_count}, Org:{org_count}, Dates:{date_count})')
                confidence_score += 25
            elif person_count >= 1 and (org_count >= 1 or date_count >= 1):
                validation['reasons'].append(f'Moderate NER signals')
                confidence_score += 10
            else:
                validation['reasons'].append(f'Weak NER signals (Person:{person_count}, Org:{org_count}, Dates:{date_count})')
                confidence_score -= 10
                
        except Exception as e:
            logger.warning(f"NER extraction failed: {e}")
            validation['reasons'].append('NER check skipped (spaCy issue)')
        
        # 7. CHECK FOR POSITIVE RESUME INDICATORS
        positive_count = sum(1 for indicator in self.resume_indicators if indicator in text_lower)
        if positive_count >= 5:
            validation['reasons'].append(f'Found {positive_count} resume-specific keywords')
            confidence_score += 15
        elif positive_count >= 3:
            confidence_score += 5
        
        # 8. CHECK FOR NEGATIVE INDICATORS (non-resume content)
        negative_count = sum(1 for indicator in self.non_resume_indicators if indicator in text_lower)
        if negative_count >= 3:
            validation['reasons'].append(f'Warning: Found {negative_count} non-resume keywords')
            confidence_score -= 30
        elif negative_count >= 1:
            confidence_score -= 10
        
        # 9. STRUCTURE CHECK (resumes have multiple paragraphs/sections)
        line_count = len([line for line in text.split('\n') if line.strip()])
        if line_count < 10:
            validation['reasons'].append('Too few lines/sections')
            confidence_score -= 15
        
        # 10. FINAL CONFIDENCE CALCULATION
        confidence_score = max(0, min(100, confidence_score))
        validation['confidence'] = round(confidence_score, 1)
        
        # DECISION: Is it a resume?
        # Strict threshold: Need high confidence OR key resume elements
        is_resume = (
            confidence_score >= 50 or  # High confidence
            (section_count >= 3 and validation['has_contact']) or  # Clear structure + contact
            (validation['has_experience'] and validation['has_education'] and validation['has_contact'])  # Core elements
        )
        
        validation['is_resume'] = is_resume
        
        if is_resume:
            logger.info(f"✓ Document validated as RESUME (confidence: {confidence_score}%)")
        else:
            logger.warning(f"✗ Document rejected as NON-RESUME (confidence: {confidence_score}%)")
        
        return is_resume, validation
    
    def get_validation_message(self, validation: Dict) -> str:
        """
        Generate user-friendly validation message
        """
        if validation['is_resume']:
            return f"✓ Document validated as resume (confidence: {validation['confidence']}%)"
        else:
            reasons = "; ".join(validation['reasons'][:3])  # Show top 3 reasons
            return f"✗ This doesn't appear to be a resume. Reasons: {reasons}"


# Singleton instance
_resume_validator = None


def get_resume_validator() -> ResumeValidator:
    """Get or create resume validator singleton"""
    global _resume_validator
    if _resume_validator is None:
        _resume_validator = ResumeValidator()
    return _resume_validator
