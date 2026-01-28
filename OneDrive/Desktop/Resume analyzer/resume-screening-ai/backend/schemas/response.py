"""
Additional Response Schemas
"""

from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class HealthResponse(BaseModel):
    """Schema for health check response"""
    status: str
    service: str
    version: str


class SkillExtractionResponse(BaseModel):
    """Schema for skill extraction response"""
    skills: List[str]
    total_skills: int


class StatisticsResponse(BaseModel):
    """Schema for statistics response"""
    total_candidates: int
    average_score: float
    top_score: float
    qualified_candidates: int


class BatchProcessingStatus(BaseModel):
    """Schema for batch processing status"""
    job_id: str
    status: str  # pending, processing, completed, failed
    total_files: int
    processed_files: int
    progress_percentage: float
    results: Optional[List[Dict[str, Any]]] = None
