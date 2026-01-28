"""
Test Suite for Resume Screening AI Backend
Run with: pytest tests/
"""

import pytest
from pathlib import Path
import sys

# Add project root to path
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from backend.utils.skill_extractor import get_skill_extractor
from backend.utils.contact_extractor import ContactExtractor
from backend.core.ml_engine_enhanced import EnhancedMLEngine, get_enhanced_ml_engine


class TestSkillExtractor:
    """Test skill extraction functionality"""
    
    def setup_method(self):
        self.extractor = get_skill_extractor()
    
    def test_extract_skills(self):
        text = "I have experience with Python, Django, and AWS cloud services."
        skills = self.extractor.extract_skills(text)
        assert 'python' in [s.lower() for s in skills]
        assert 'django' in [s.lower() for s in skills]
        assert 'aws' in [s.lower() for s in skills]
    
    def test_match_skills(self):
        resume_skills = ['python', 'django', 'postgresql']
        required_skills = ['python', 'django', 'aws']
        score, matched, missing = self.extractor.compute_skill_match_score(resume_skills, required_skills)
        assert 'python' in [s.lower() for s in matched]
        assert 'django' in [s.lower() for s in matched]
        assert 'aws' in [s.lower() for s in missing]


class TestContactExtractor:
    """Test contact information extraction"""
    
    def setup_method(self):
        self.extractor = ContactExtractor()
    
    def test_extract_email(self):
        text = "Contact me at john.doe@example.com for more information."
        email = self.extractor.extract_email(text)
        assert email == "john.doe@example.com"
    
    def test_extract_phone(self):
        text = "Phone: +1-234-567-8900"
        phone = self.extractor.extract_phone(text)
        assert phone is not None
    
    def test_extract_experience_years(self):
        text = "I have 5 years of experience in software development."
        years = self.extractor.extract_experience_years(text)
        assert years == 5.0


class TestMLEngine:
    """Test ML engine functionality"""
    
    def setup_method(self):
        self.engine = get_enhanced_ml_engine(use_custom=False)
    
    def test_compute_skill_match_score(self):
        found_skills = ['python', 'django', 'postgresql']
        required_skills = ['python', 'django', 'aws', 'docker']
        score = self.engine.compute_skill_match_score(found_skills, required_skills)
        assert 0 <= score <= 100
        # Note: New skill matcher uses fuzzy matching and boosting
        assert score >= 40  # At least 2 out of 4 skills matched
    
    def test_compute_experience_score(self):
        score = self.engine.compute_experience_score(5, 3)
        assert 0 <= score <= 100
        assert score >= 80  # 5 years exceeds requirement of 3
    
    def test_calculate_final_score(self):
        final = self.engine.calculate_final_score(80, 70, 90, 85)
        assert 0 <= final <= 100


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
