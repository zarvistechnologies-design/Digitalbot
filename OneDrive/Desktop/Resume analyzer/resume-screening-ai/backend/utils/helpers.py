"""
Helper Utilities
Common utility functions
"""

import os
import hashlib
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)


def generate_file_hash(file_path: str) -> str:
    """
    Generate MD5 hash of a file
    
    Args:
        file_path: Path to file
        
    Returns:
        MD5 hash string
    """
    hash_md5 = hashlib.md5()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_md5.update(chunk)
    return hash_md5.hexdigest()


def cleanup_temp_files(directory: Path, max_age_hours: int = 24):
    """
    Clean up old temporary files
    
    Args:
        directory: Directory to clean
        max_age_hours: Maximum age of files in hours
    """
    import time
    
    if not directory.exists():
        return
    
    current_time = time.time()
    max_age_seconds = max_age_hours * 3600
    
    for file_path in directory.iterdir():
        if file_path.is_file():
            file_age = current_time - file_path.stat().st_mtime
            if file_age > max_age_seconds:
                try:
                    file_path.unlink()
                    logger.info(f"Deleted old temp file: {file_path}")
                except Exception as e:
                    logger.error(f"Error deleting {file_path}: {e}")


def validate_file_type(filename: str, allowed_extensions: list) -> bool:
    """
    Validate file type by extension
    
    Args:
        filename: Name of file
        allowed_extensions: List of allowed extensions
        
    Returns:
        True if valid, False otherwise
    """
    ext = Path(filename).suffix.lower()
    return ext in allowed_extensions


def format_score(score: float) -> str:
    """
    Format score as percentage string
    
    Args:
        score: Score value (0-100)
        
    Returns:
        Formatted string
    """
    return f"{score:.1f}%"


def truncate_text(text: str, max_length: int = 200) -> str:
    """
    Truncate text to maximum length
    
    Args:
        text: Text to truncate
        max_length: Maximum length
        
    Returns:
        Truncated text
    """
    if len(text) <= max_length:
        return text
    return text[:max_length] + "..."
