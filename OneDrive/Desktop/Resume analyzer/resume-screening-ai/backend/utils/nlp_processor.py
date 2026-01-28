"""
NLP Preprocessing Pipeline using spaCy
Tokenization, Lemmatization, POS Tagging, NER
"""

import spacy
import nltk
from typing import List, Dict, Tuple, Set
import logging
import re

logger = logging.getLogger(__name__)

# Download NLTK data (stopwords)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.corpus import stopwords

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    logger.error("spaCy model not found. Run: python -m spacy download en_core_web_sm")
    nlp = None


class NLPProcessor:
    """
    Advanced NLP processing for resume and job description analysis
    """
    
    def __init__(self):
        self.nlp = nlp
        self.stop_words = set(stopwords.words('english'))
        
        # Technical terms that should NOT be removed even if they look like stop words
        self.technical_preserve = {
            'in', 'to', 'with', 'for', 'as', 'or', 'and', 'not'  # Common in tech (SQL, etc.)
        }
    
    def preprocess_text(
        self, 
        text: str, 
        remove_stopwords: bool = False,
        lemmatize: bool = True
    ) -> str:
        """
        Preprocess text with tokenization and lemmatization
        
        Args:
            text: Input text
            remove_stopwords: Whether to remove stopwords
            lemmatize: Whether to lemmatize words
            
        Returns:
            Preprocessed text
        """
        if not self.nlp or not text:
            return text
        
        try:
            doc = self.nlp(text)
            
            tokens = []
            for token in doc:
                # Skip punctuation and spaces
                if token.is_punct or token.is_space:
                    continue
                
                # Get lemma or original text
                word = token.lemma_ if lemmatize else token.text
                
                # Remove stopwords (but preserve technical terms)
                if remove_stopwords:
                    if token.text.lower() in self.stop_words and token.text.lower() not in self.technical_preserve:
                        continue
                
                tokens.append(word)
            
            return " ".join(tokens)
            
        except Exception as e:
            logger.error(f"Error preprocessing text: {e}")
            return text
    
    def extract_named_entities(self, text: str) -> Dict[str, List[str]]:
        """
        Extract named entities using spaCy NER
        
        Returns:
            Dictionary of entity types and their values
            {
                'PERSON': ['John Doe'],
                'ORG': ['Google', 'Microsoft'],
                'GPE': ['New York', 'USA'],
                'DATE': ['2020-2023'],
                ...
            }
        """
        if not self.nlp or not text:
            return {}
        
        try:
            doc = self.nlp(text)
            
            entities = {}
            for ent in doc.ents:
                if ent.label_ not in entities:
                    entities[ent.label_] = []
                entities[ent.label_].append(ent.text)
            
            # Remove duplicates
            entities = {k: list(set(v)) for k, v in entities.items()}
            
            logger.info(f"Extracted {sum(len(v) for v in entities.values())} entities")
            return entities
            
        except Exception as e:
            logger.error(f"Error extracting entities: {e}")
            return {}
    
    def extract_candidate_name(self, text: str) -> str:
        """
        Extract candidate name from resume using NER
        """
        if not self.nlp or not text:
            return "Anonymous"
        
        try:
            # Look in first 500 characters (name usually at top)
            doc = self.nlp(text[:500])
            
            # Find PERSON entities
            persons = [ent.text for ent in doc.ents if ent.label_ == 'PERSON']
            
            if persons:
                # Return first person found
                name = persons[0]
                
                # Validate name (should be 2-4 words)
                words = name.split()
                if 2 <= len(words) <= 4:
                    return name
            
            # Fallback: Look for capitalized words in first 3 lines
            lines = text.split('\n')[:3]
            for line in lines:
                line = line.strip()
                # Skip lines with emails, phones, etc.
                if '@' in line or any(char.isdigit() for char in line):
                    continue
                
                # Check if line is a name (2-4 capitalized words)
                words = line.split()
                if 2 <= len(words) <= 4 and all(w[0].isupper() for w in words if w):
                    return line
            
            return "Anonymous"
            
        except Exception as e:
            logger.error(f"Error extracting name: {e}")
            return "Anonymous"
    
    def extract_organizations(self, text: str) -> List[str]:
        """
        Extract company/organization names from resume
        """
        if not self.nlp or not text:
            return []
        
        try:
            doc = self.nlp(text)
            orgs = [ent.text for ent in doc.ents if ent.label_ == 'ORG']
            return list(set(orgs))
        except Exception as e:
            logger.error(f"Error extracting organizations: {e}")
            return []
    
    def extract_dates(self, text: str) -> List[str]:
        """
        Extract dates from resume (work experience periods)
        """
        if not self.nlp or not text:
            return []
        
        try:
            doc = self.nlp(text)
            dates = [ent.text for ent in doc.ents if ent.label_ == 'DATE']
            return dates
        except Exception as e:
            logger.error(f"Error extracting dates: {e}")
            return []
    
    def get_pos_tags(self, text: str) -> List[Tuple[str, str]]:
        """
        Get Part-of-Speech tags for text
        Returns list of (word, POS_tag) tuples
        """
        if not self.nlp or not text:
            return []
        
        try:
            doc = self.nlp(text)
            return [(token.text, token.pos_) for token in doc if not token.is_punct and not token.is_space]
        except Exception as e:
            logger.error(f"Error getting POS tags: {e}")
            return []
    
    def extract_noun_phrases(self, text: str) -> List[str]:
        """
        Extract noun phrases (useful for skills and qualifications)
        """
        if not self.nlp or not text:
            return []
        
        try:
            doc = self.nlp(text)
            noun_phrases = [chunk.text for chunk in doc.noun_chunks]
            return noun_phrases
        except Exception as e:
            logger.error(f"Error extracting noun phrases: {e}")
            return []
    
    def tokenize(self, text: str) -> List[str]:
        """
        Simple tokenization
        """
        if not self.nlp or not text:
            return text.split()
        
        try:
            doc = self.nlp(text)
            return [token.text for token in doc if not token.is_punct and not token.is_space]
        except Exception as e:
            logger.error(f"Error tokenizing: {e}")
            return text.split()
