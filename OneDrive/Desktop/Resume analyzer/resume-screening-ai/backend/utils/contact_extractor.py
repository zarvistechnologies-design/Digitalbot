"""
Contact Information Extractor
Extract name, email, phone, and other contact details from resume text
"""

import re
from typing import Optional, Dict
import logging

logger = logging.getLogger(__name__)


class ContactExtractor:
    """Extract contact information from resume text"""
    
    @staticmethod
    def extract_email(text: str) -> Optional[str]:
        """
        Extract email address from text
        
        Args:
            text: Resume text
            
        Returns:
            Email address or None
        """
        if not text:
            return None
        
        # Email regex pattern
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        matches = re.findall(email_pattern, text)
        
        return matches[0] if matches else None
    
    @staticmethod
    def extract_phone(text: str) -> Optional[str]:
        """
        Extract phone number from text
        
        Args:
            text: Resume text
            
        Returns:
            Phone number or None
        """
        if not text:
            return None
        
        # Phone number patterns (supports various formats)
        patterns = [
            r'(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',  # US format
            r'(\+\d{1,3}[-.\s]?)?\d{10}',  # 10 digits
            r'(\+\d{1,3}[-.\s]?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}',  # With separators
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text)
            if matches:
                # Clean and format
                phone = ''.join(filter(str.isdigit, matches[0]))
                if len(phone) >= 10:
                    return matches[0]
        
        return None
    
    @staticmethod
    def extract_name(text: str) -> Optional[str]:
        """
        Extract name from text
        
        Args:
            text: Resume text
            
        Returns:
            Extracted name or fallback
        """
        if not text:
            return "Anonymous"
        
        # Split into lines
        lines = [l.strip() for l in text.split('\n') if l.strip()]
        
        if not lines:
            return "Anonymous"
        
        # Common skip words
        skip_words = {
            'resume', 'cv', 'curriculum', 'vitae', 'profile', 'summary',
            'objective', 'experience', 'education', 'skills', 'work',
            'contact', 'phone', 'email', 'address', 'about'
        }
        
        # Look through first 20 lines
        for i, line in enumerate(lines[:20]):
            # Skip long lines
            if len(line) > 60:
                continue
            
            # Skip lines with email/phone/URL
            if '@' in line or 'http' in line.lower() or 'www.' in line.lower():
                continue
            
            if re.search(r'\d{3,}', line):
                continue
            
            words = line.split()
            
            # Skip if no words or too many
            if not words or len(words) > 5:
                continue
            
            # Skip all caps headers
            if line.isupper() and len(words) > 1:
                continue
            
            # Find name words
            name_words = []
            for word in words:
                clean = word.strip('.,;:-_')
                
                if not clean or len(clean) < 2:
                    continue
                
                if clean.lower() in skip_words:
                    continue
                
                if not any(c.isupper() for c in clean):
                    continue
                
                # At least 70% letters
                if sum(c.isalpha() for c in clean) / len(clean) >= 0.7:
                    name_words.append(clean)
            
            # Found 2-4 name words
            if 2 <= len(name_words) <= 4:
                return ' '.join(name_words)
            
            # Single word - check next line
            if len(name_words) == 1 and len(name_words[0]) >= 3:
                first = name_words[0]
                if i + 1 < len(lines):
                    next_words = lines[i + 1].split()
                    if len(next_words) == 1:
                        next_clean = next_words[0].strip('.,;:-_')
                        if next_clean and len(next_clean) >= 2:
                            if any(c.isupper() for c in next_clean):
                                if sum(c.isalpha() for c in next_clean) / len(next_clean) >= 0.7:
                                    return f"{first} {next_clean}"
                return first
        
        # Fallback: first capitalized words
        first_words = lines[0].split()[:3]
        caps = [w.strip('.,;:-_') for w in first_words if w and w[0].isupper()]
        if caps:
            return ' '.join(caps[:2])
        
        return "Anonymous"
    
    @staticmethod
    def extract_experience_years(text: str) -> Optional[float]:
        """
        Extract years of experience from text
        
        Args:
            text: Resume text
            
        Returns:
            Years of experience or None
        """
        if not text:
            return None
        
        text_lower = text.lower()
        
        # Patterns to match experience mentions
        patterns = [
            r'(\d+)\+?\s*years?\s+(?:of\s+)?experience',
            r'experience[:\s]+(\d+)\+?\s*years?',
            r'(\d+)\+?\s*years?\s+in',
        ]
        
        for pattern in patterns:
            matches = re.findall(pattern, text_lower)
            if matches:
                try:
                    return float(matches[0])
                except ValueError:
                    continue
        
        return None
    
    @staticmethod
    def extract_education(text: str) -> list:
        """
        Extract education qualifications from text
        
        Args:
            text: Resume text
            
        Returns:
            List of education qualifications
        """
        if not text:
            return []
        
        text_lower = text.lower()
        education_keywords = [
            'phd', 'ph.d', 'doctorate',
            'master', 'mba', 'm.tech', 'ms', 'm.s', 'm.sc', 'ma',
            'bachelor', 'b.tech', 'b.e', 'bs', 'b.s', 'b.sc', 'ba',
            'diploma', 'associate degree'
        ]
        
        found_education = []
        for keyword in education_keywords:
            if keyword in text_lower:
                found_education.append(keyword.upper())
        
        return list(set(found_education))  # Remove duplicates
    
    @staticmethod
    def extract_all_contact_info(text: str) -> Dict[str, any]:
        """
        Extract all contact information from text
        
        Args:
            text: Resume text
            
        Returns:
            Dictionary with all contact information
        """
        return {
            'name': ContactExtractor.extract_name(text),
            'email': ContactExtractor.extract_email(text),
            'phone': ContactExtractor.extract_phone(text),
            'experience_years': ContactExtractor.extract_experience_years(text),
            'education': ContactExtractor.extract_education(text)
        }


# Singleton instance
_contact_extractor_instance = None


def get_contact_extractor() -> ContactExtractor:
    """Get or create contact extractor singleton"""
    global _contact_extractor_instance
    if _contact_extractor_instance is None:
        _contact_extractor_instance = ContactExtractor()
    return _contact_extractor_instance
