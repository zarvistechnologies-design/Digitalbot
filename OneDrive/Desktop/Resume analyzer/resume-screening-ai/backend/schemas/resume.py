"""
Pydantic Schemas for Request/Response Validation
Resume and Candidate Schemas
"""

from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime


class ResumeUploadRequest(BaseModel):
    """Schema for resume upload request"""
    job_description: str = Field(..., min_length=50, description="Job description text")


class SkillSchema(BaseModel):
    """Schema for skill information"""
    name: str
    confidence: Optional[float] = None


class CandidateResponse(BaseModel):
    """Schema for candidate analysis response"""
    id: Optional[int] = None
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    filename: str
    
    # Scores
    final_score: float = Field(..., ge=0, le=100)
    semantic_score: float = Field(..., ge=0, le=100)
    skill_match_score: float = Field(..., ge=0, le=100)
    experience_score: float = Field(..., ge=0, le=100)
    education_score: float = Field(..., ge=0, le=100)
    
    # Details
    experience_years: Optional[float] = None
    education: Optional[List[str]] = None
    skills_found: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class ProcessResponse(BaseModel):
    """Schema for process endpoint response"""
    success: bool
    message: str
    total_candidates: int
    results: List[CandidateResponse]
    processing_time: float


class ErrorResponse(BaseModel):
    """Schema for error responses"""
    error: str
    detail: Optional[str] = None
    status_code: int
