"""
Resume Parser Utility
Extract text from PDF and DOCX files
"""

import PyPDF2
import docx
from pathlib import Path
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class ResumeParser:
    """Parser for extracting text from resume files"""
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> Optional[str]:
        """
        Extract text from PDF file
        
        Args:
            file_path: Path to PDF file
            
        Returns:
            Extracted text or None if error
        """
        try:
            text = ""
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Check if PDF has pages
                if len(pdf_reader.pages) == 0:
                    logger.warning(f"PDF has no pages: {file_path}")
                    return None
                
                # Try to extract text from each page
                for page_num, page in enumerate(pdf_reader.pages):
                    try:
                        page_text = page.extract_text()
                        if page_text:
                            text += page_text + "\n"
                    except Exception as e:
                        logger.warning(f"Error extracting page {page_num} from {file_path}: {e}")
                        continue
                
                text = text.strip()
                
                # Check if we got any text
                if not text or len(text) < 10:
                    logger.warning(f"PDF appears to be empty or image-based: {file_path}")
                    logger.warning(f"Extracted only {len(text)} characters. PDF might be scanned.")
                    return None
                
                return text
                
        except Exception as e:
            logger.error(f"Error extracting text from PDF {file_path}: {e}")
            return None
    
    @staticmethod
    def extract_text_from_docx(file_path: str) -> Optional[str]:
        """
        Extract text from DOCX file
        
        Args:
            file_path: Path to DOCX file
            
        Returns:
            Extracted text or None if error
        """
        try:
            doc = docx.Document(file_path)
            text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            return text.strip()
        except Exception as e:
            logger.error(f"Error extracting text from DOCX {file_path}: {e}")
            return None
    
    @staticmethod
    def parse_resume(file_path: str) -> Optional[str]:
        """
        Parse resume file and extract text
        Automatically detects file type
        
        Args:
            file_path: Path to resume file
            
        Returns:
            Extracted text or None if error
        """
        file_path = Path(file_path)
        
        if not file_path.exists():
            logger.error(f"File not found: {file_path}")
            return None
        
        file_extension = file_path.suffix.lower()
        
        if file_extension == '.pdf':
            return ResumeParser.extract_text_from_pdf(str(file_path))
        elif file_extension in ['.docx', '.doc']:
            return ResumeParser.extract_text_from_docx(str(file_path))
        else:
            logger.error(f"Unsupported file format: {file_extension}")
            return None
    
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Clean and normalize extracted text
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Remove extra whitespace
        text = " ".join(text.split())
        
        # Remove special characters but keep important punctuation
        import re
        text = re.sub(r'[^\w\s\-@.+(),]', ' ', text)
        
        # Remove multiple spaces
        text = re.sub(r'\s+', ' ', text)
        
        return text.strip()
