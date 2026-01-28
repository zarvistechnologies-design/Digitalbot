"""
Configuration and Settings
Centralized configuration for the application
"""

from pydantic_settings import BaseSettings
from typing import List
import os
from pathlib import Path


class Settings(BaseSettings):
    """Application settings"""
    
    # Application
    APP_NAME: str = "Resume Screening AI"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:8501",  # Streamlit default port
        "http://127.0.0.1:8501",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # Paths
    BASE_DIR: Path = Path(__file__).parent.parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    RESUMES_DIR: Path = DATA_DIR / "resumes"
    JOB_DESCRIPTIONS_DIR: Path = DATA_DIR / "job_descriptions"
    PROCESSED_DIR: Path = DATA_DIR / "processed"
    SKILLS_DIR: Path = DATA_DIR / "skills"
    MODELS_DIR: Path = BASE_DIR / "models"
    LOGS_DIR: Path = BASE_DIR / "logs"
    TEMP_DIR: Path = BASE_DIR / "temp"
    UPLOADS_DIR: Path = TEMP_DIR / "uploads"
    TRAINING_DATA_DIR: Path = DATA_DIR / "training"
    
    # ML Model Settings
    MODEL_NAME: str = "sentence-transformers/all-MiniLM-L6-v2"
    MODEL_CACHE_DIR: Path = MODELS_DIR / "sentence-transformer"
    SIMILARITY_THRESHOLD: float = 0.5
    
    # Scoring Weights (NEW FORMULA - skills and experience focused)
    SKILL_MATCH_WEIGHT: float = 0.40     # Skills are most important (40%)
    EXPERIENCE_WEIGHT: float = 0.30      # Experience matters significantly (30%)
    SEMANTIC_SCORE_WEIGHT: float = 0.20  # Semantic understanding (20%)
    EDUCATION_WEIGHT: float = 0.10       # Education is least critical (10%)
    
    # File Upload Settings
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
    MAX_FILES: int = 50
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".docx"]
    
    # Database (SQLite for simplicity, can be upgraded to PostgreSQL)
    DATABASE_URL: str = f"sqlite:///{BASE_DIR}/resume_screening.db"
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: Path = LOGS_DIR / "app.log"
    
    # Skills Database
    SKILLS_JSON_PATH: Path = SKILLS_DIR / "tech_skills.json"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Create necessary directories
for directory in [
    settings.DATA_DIR,
    settings.RESUMES_DIR,
    settings.JOB_DESCRIPTIONS_DIR,
    settings.PROCESSED_DIR,
    settings.SKILLS_DIR,
    settings.MODELS_DIR,
    settings.LOGS_DIR,
    settings.TEMP_DIR,
    settings.UPLOADS_DIR,
    settings.TRAINING_DATA_DIR,
]:
    directory.mkdir(parents=True, exist_ok=True)
