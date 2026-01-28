"""
Formatting utilities for Streamlit UI
"""

from typing import List, Optional


def format_score(score: float) -> str:
    """
    Format score as percentage
    
    Args:
        score: Score value (0-100)
        
    Returns:
        Formatted score string
    """
    return f"{score:.1f}%"


def format_experience(years: Optional[int]) -> str:
    """
    Format experience years
    
    Args:
        years: Years of experience
        
    Returns:
        Formatted experience string
    """
    if years is None or years == 0:
        return "Not specified"
    elif years == 1:
        return "1 year"
    else:
        return f"{years} years"


def truncate_text(text: str, max_length: int = 100) -> str:
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


def format_skills_list(skills: List[str], max_display: int = 10) -> str:
    """
    Format skills list for display
    
    Args:
        skills: List of skills
        max_display: Maximum number of skills to display
        
    Returns:
        Formatted skills string
    """
    if not skills:
        return "None"
    
    if len(skills) <= max_display:
        return ", ".join(skills)
    
    displayed = ", ".join(skills[:max_display])
    remaining = len(skills) - max_display
    return f"{displayed} (+{remaining} more)"
