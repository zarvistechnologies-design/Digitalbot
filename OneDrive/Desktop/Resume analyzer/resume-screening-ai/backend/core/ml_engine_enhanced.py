"""
Enhanced ML Engine with Custom Training Support
Combines pre-trained model with custom fine-tuning for better accuracy
"""

import numpy as np
import torch
from sentence_transformers import SentenceTransformer, InputExample, losses, evaluation
from torch.utils.data import DataLoader
from typing import List, Dict, Tuple, Optional
import logging
from pathlib import Path
import json
from datetime import datetime

from backend.core.config import settings

logger = logging.getLogger(__name__)


class EnhancedMLEngine:
    """
    Enhanced ML Engine with training capabilities
    
    Features:
    1. Uses pre-trained model (for immediate use)
    2. Supports fine-tuning on your own data (for better accuracy)
    3. Can learn from user feedback
    """
    
    def __init__(self, use_custom_model: bool = False):
        """
        Initialize ML model
        
        Args:
            use_custom_model: If True, uses custom trained model, else pre-trained
        """
        self.model = None
        self.custom_model_path = settings.MODELS_DIR / "custom_model"
        self.use_custom_model = use_custom_model
        self.load_model()
    
    def load_model(self):
        """Load pre-trained or custom fine-tuned model"""
        try:
            if self.use_custom_model and self.custom_model_path.exists():
                logger.info(f"Loading custom trained model from {self.custom_model_path}")
                self.model = SentenceTransformer(str(self.custom_model_path), local_files_only=True)
                logger.info("Custom model loaded successfully")
            else:
                logger.info(f"Loading pre-trained model: {settings.MODEL_NAME}")
                self.model = SentenceTransformer(
                    settings.MODEL_NAME,
                    cache_folder=str(settings.MODEL_CACHE_DIR),
                    local_files_only=True
                )
                logger.info("Pre-trained model loaded successfully")
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            # Try without local_files_only as fallback
            try:
                logger.info("Retrying without local_files_only...")
                self.model = SentenceTransformer(
                    settings.MODEL_NAME,
                    cache_folder=str(settings.MODEL_CACHE_DIR)
                )
                logger.info("Model loaded successfully from internet")
            except Exception as e2:
                logger.error(f"Failed to load model: {e2}")
                raise
    
    def prepare_training_data(
        self, 
        training_file: str
    ) -> List[InputExample]:
        """
        Prepare training data from JSON file
        
        Expected format:
        [
            {
                "resume": "Resume text...",
                "job_description": "Job description...",
                "score": 0.85  # Human-labeled score (0-1)
            },
            ...
        ]
        
        Args:
            training_file: Path to JSON file with training data
            
        Returns:
            List of InputExample objects
        """
        try:
            with open(training_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            examples = []
            for item in data:
                example = InputExample(
                    texts=[item['resume'], item['job_description']],
                    label=float(item['score'])  # Similarity score (0-1)
                )
                examples.append(example)
            
            logger.info(f"Prepared {len(examples)} training examples")
            return examples
            
        except Exception as e:
            logger.error(f"Error preparing training data: {e}")
            return []
    
    def train_custom_model(
        self,
        training_file: str,
        validation_file: Optional[str] = None,
        epochs: int = 4,
        batch_size: int = 16,
        learning_rate: float = 2e-5
    ) -> Dict:
        """
        Fine-tune the model on custom data
        
        Args:
            training_file: Path to training data JSON
            validation_file: Optional validation data
            epochs: Number of training epochs
            batch_size: Training batch size
            learning_rate: Learning rate
            
        Returns:
            Training metrics
        """
        try:
            logger.info("Starting custom model training...")
            
            # Prepare training data
            train_examples = self.prepare_training_data(training_file)
            if not train_examples:
                raise ValueError("No training data available")
            
            # Create DataLoader
            train_dataloader = DataLoader(
                train_examples, 
                shuffle=True, 
                batch_size=batch_size
            )
            
            # Define loss function (Cosine Similarity Loss)
            train_loss = losses.CosineSimilarityLoss(self.model)
            
            # Prepare evaluator if validation data provided
            evaluator = None
            if validation_file:
                val_examples = self.prepare_training_data(validation_file)
                if val_examples:
                    # Extract sentences and scores for evaluation
                    sentences1 = [ex.texts[0] for ex in val_examples]
                    sentences2 = [ex.texts[1] for ex in val_examples]
                    scores = [ex.label for ex in val_examples]
                    
                    evaluator = evaluation.EmbeddingSimilarityEvaluator(
                        sentences1, sentences2, scores
                    )
            
            # Training
            logger.info(f"Training for {epochs} epochs...")
            
            # Use older sentence-transformers API
            self.model.fit(
                train_objectives=[(train_dataloader, train_loss)],
                epochs=epochs,
                warmup_steps=int(len(train_dataloader) * 0.1),
                evaluator=None,  # Disable evaluation
                output_path=str(self.custom_model_path),
                save_best_model=False,  # Can't save best without evaluation
                show_progress_bar=True
            )
            
            logger.info(f"Model saved to {self.custom_model_path}")
            
            # Save training metadata
            metadata = {
                "trained_at": datetime.now().isoformat(),
                "epochs": epochs,
                "batch_size": batch_size,
                "learning_rate": learning_rate,
                "training_samples": len(train_examples),
                "base_model": settings.MODEL_NAME
            }
            
            metadata_file = self.custom_model_path / "training_metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            return metadata
            
        except Exception as e:
            logger.error(f"Error training model: {e}")
            raise
    
    def collect_feedback(
        self,
        resume_text: str,
        job_description: str,
        predicted_score: float,
        actual_score: float,
        feedback_file: Optional[str] = None
    ):
        """
        Collect user feedback for continuous learning
        
        Args:
            resume_text: Resume content
            job_description: Job description
            predicted_score: Model's predicted score
            actual_score: Human expert's score
            feedback_file: File to save feedback
        """
        if feedback_file is None:
            feedback_file = settings.TRAINING_DATA_DIR / "feedback_data.json"
        
        # Load existing feedback
        feedback_data = []
        if Path(feedback_file).exists():
            with open(feedback_file, 'r', encoding='utf-8') as f:
                feedback_data = json.load(f)
        
        # Add new feedback
        feedback_data.append({
            "resume": resume_text,
            "job_description": job_description,
            "predicted_score": predicted_score,
            "actual_score": actual_score,
            "score": actual_score,  # For training format
            "timestamp": datetime.now().isoformat(),
            "error": abs(predicted_score - actual_score)
        })
        
        # Save feedback
        with open(feedback_file, 'w', encoding='utf-8') as f:
            json.dump(feedback_data, f, indent=2, ensure_ascii=False)
        
        logger.info(f"Feedback collected. Total samples: {len(feedback_data)}")
        
        # Auto-retrain if enough feedback collected
        if len(feedback_data) >= 100:  # Retrain after 100 feedback samples
            logger.info("Enough feedback collected. Consider retraining the model.")
    
    def compute_semantic_similarity(self, text1: str, text2: str) -> float:
        """
        Compute semantic similarity between two texts with advanced techniques
        
        Args:
            text1: First text (e.g., resume)
            text2: Second text (e.g., job description)
            
        Returns:
            Similarity score (0-100)
        """
        try:
            from sentence_transformers import util
            import torch
            
            # 1. Full document similarity
            embedding1 = self.model.encode(text1, convert_to_tensor=True)
            embedding2 = self.model.encode(text2, convert_to_tensor=True)
            full_similarity = util.cos_sim(embedding1, embedding2).item()
            
            # 2. Chunk-based similarity (better for long documents)
            # Split texts into sentences/chunks
            def chunk_text(text, max_length=200):
                """Split text into overlapping chunks"""
                words = text.split()
                chunks = []
                for i in range(0, len(words), max_length // 2):
                    chunk = ' '.join(words[i:i + max_length])
                    if chunk.strip():
                        chunks.append(chunk)
                return chunks if chunks else [text]
            
            resume_chunks = chunk_text(text1)
            jd_chunks = chunk_text(text2)
            
            # Encode all chunks
            resume_embeddings = self.model.encode(resume_chunks, convert_to_tensor=True)
            jd_embeddings = self.model.encode(jd_chunks, convert_to_tensor=True)
            
            # Compute max similarity for each JD chunk with all resume chunks
            chunk_similarities = []
            for jd_emb in jd_embeddings:
                max_sim = max([util.cos_sim(jd_emb, res_emb).item() for res_emb in resume_embeddings])
                chunk_similarities.append(max_sim)
            
            chunk_similarity = sum(chunk_similarities) / len(chunk_similarities) if chunk_similarities else 0
            
            # 3. Keyword overlap boost (helps with technical terms)
            def extract_keywords(text):
                """Extract important keywords (capitalized, technical terms)"""
                import re
                # Get words that are capitalized or contain special chars (technical terms)
                words = set(re.findall(r'\b[A-Z][a-z]+\b|\b[A-Z]{2,}\b|[a-zA-Z]+\+\+|[a-zA-Z]+\.js', text))
                # Add common technical terms in lowercase
                technical = set(re.findall(r'\b(?:python|java|react|django|flask|fastapi|aws|azure|gcp|docker|kubernetes|sql|api|rest|graphql|git|ci/cd|microservices|redis|postgresql|mongodb|machine learning|deep learning|nlp|tensorflow|pytorch)\b', text.lower()))
                return words.union(technical)
            
            resume_keywords = extract_keywords(text1)
            jd_keywords = extract_keywords(text2)
            
            if jd_keywords:
                keyword_overlap = len(resume_keywords.intersection(jd_keywords)) / len(jd_keywords)
            else:
                keyword_overlap = 0
            
            # 3.5. SENIORITY CONTEXT BOOST
            # If JD mentions "senior" and resume has "senior", boost score
            text1_lower = text1.lower()
            text2_lower = text2.lower()
            
            seniority_boost = 0
            senior_terms = ['senior', 'lead', 'principal', 'staff', 'architect']
            jd_has_senior = any(term in text2_lower for term in senior_terms)
            resume_has_senior = any(term in text1_lower for term in senior_terms)
            
            if jd_has_senior and resume_has_senior:
                seniority_boost = 0.10  # 10% boost for matching seniority
            elif jd_has_senior and not resume_has_senior:
                seniority_boost = -0.15  # 15% penalty for seniority mismatch
            
            # 4. Combine scores with weights
            # - Full document similarity: 50% (contextual understanding)
            # - Chunk-based similarity: 30% (detailed matching)
            # - Keyword overlap: 20% (exact technical terms)
            combined_score = (
                full_similarity * 0.50 +
                chunk_similarity * 0.30 +
                keyword_overlap * 0.20 +
                seniority_boost  # Add seniority context
            ) * 100
            
            # 5. SUPER AGGRESSIVE CALIBRATION like ChatGPT
            # ChatGPT gives 85-95% for good matches, we do the same
            if combined_score < 10:
                # Very poor match - keep very low (0-15%)
                calibrated_score = combined_score * 1.5
            elif combined_score < 25:
                # Poor match (15-40%)
                calibrated_score = 15 + (combined_score - 10) * 1.67
            elif combined_score < 40:
                # Fair match (40-65%)
                calibrated_score = 40 + (combined_score - 25) * 1.67
            elif combined_score < 55:
                # Good match (65-85%)
                calibrated_score = 65 + (combined_score - 40) * 1.33
            else:
                # Excellent match (85-98%) - LIKE CHATGPT
                calibrated_score = 85 + (combined_score - 55) * 0.29
            
            return max(0, min(100, calibrated_score))
        except Exception as e:
            logger.error(f"Error computing similarity: {e}")
            return 0.0
    
    def compute_skill_match_score(
        self, 
        found_skills: List[str], 
        required_skills: List[str]
    ) -> float:
        """
        Compute weighted skill match score with fuzzy matching
        Critical skills have higher weight
        """
        if not required_skills:
            return 100.0
        
        try:
            from rapidfuzz import fuzz
        except ImportError:
            fuzz = None
        
        # Skill importance weights (critical skills get higher weight)
        skill_weights = {
            # Programming Languages (HIGH PRIORITY)
            'python': 1.5, 'java': 1.5, 'javascript': 1.5, 'typescript': 1.5,
            'c++': 1.5, 'c#': 1.5, 'go': 1.5, 'rust': 1.5, 'kotlin': 1.5,
            
            # Frameworks (CRITICAL)
            'django': 1.5, 'flask': 1.5, 'fastapi': 1.5, 'spring': 1.5,
            'react': 1.5, 'angular': 1.5, 'vue': 1.5, 'node.js': 1.5,
            'express': 1.5, '.net': 1.5, 'asp.net': 1.5,
            
            # Databases (HIGH PRIORITY)
            'postgresql': 1.3, 'mysql': 1.3, 'mongodb': 1.3, 'redis': 1.3,
            'oracle': 1.3, 'sql server': 1.3, 'cassandra': 1.3, 'dynamodb': 1.3,
            
            # Cloud & DevOps (HIGH PRIORITY)
            'aws': 1.3, 'azure': 1.3, 'gcp': 1.3, 'docker': 1.3,
            'kubernetes': 1.3, 'k8s': 1.3, 'terraform': 1.3, 'jenkins': 1.3,
            'ci/cd': 1.3, 'gitlab': 1.3, 'github actions': 1.3,
            
            # Data Science/ML (HIGH PRIORITY for ML roles)
            'tensorflow': 1.4, 'pytorch': 1.4, 'scikit-learn': 1.4,
            'pandas': 1.4, 'numpy': 1.4, 'keras': 1.4, 'machine learning': 1.4,
            'deep learning': 1.4, 'nlp': 1.4, 'computer vision': 1.4,
            
            # API & Architecture (MEDIUM PRIORITY)
            'rest api': 1.2, 'graphql': 1.2, 'microservices': 1.2,
            'api': 1.2, 'restful': 1.2, 'grpc': 1.2, 'soap': 1.2,
            
            # Version Control (STANDARD)
            'git': 1.0, 'github': 1.0, 'gitlab': 1.0, 'bitbucket': 1.0,
            
            # Testing (MEDIUM PRIORITY)
            'pytest': 1.2, 'unittest': 1.2, 'jest': 1.2, 'junit': 1.2,
            'selenium': 1.2, 'cypress': 1.2, 'testing': 1.2,
            
            # Other skills (STANDARD)
            'default': 1.0
        }
        
        # Skill synonyms
        skill_synonyms = {
            'javascript': ['js', 'node', 'nodejs'],
            'typescript': ['ts'],
            'kubernetes': ['k8s'],
            'postgresql': ['postgres', 'psql'],
            'mongodb': ['mongo'],
        }
        
        found_skills_lower = [s.lower().strip() for s in found_skills]
        required_skills_lower = [s.lower().strip() for s in required_skills]
        
        total_weight = 0.0
        matched_weight = 0.0
        
        for skill in required_skills_lower:
            # Get weight for this skill (default to 1.0)
            weight = skill_weights.get(skill, skill_weights['default'])
            total_weight += weight
            
            best_match = 0.0
            
            # Check if skill is found (exact)
            if skill in found_skills_lower:
                best_match = 1.0
            else:
                # Check synonyms
                if skill in skill_synonyms:
                    for syn in skill_synonyms[skill]:
                        if syn in found_skills_lower:
                            best_match = max(best_match, 0.95)
                
                # Partial match for similar skills (more generous)
                for found_skill in found_skills_lower:
                    if skill in found_skill or found_skill in skill:
                        best_match = max(best_match, 0.85)  # Increased from 0.8
                    
                    # Fuzzy match (more forgiving)
                    if fuzz and len(skill) > 3:
                        similarity = fuzz.ratio(skill, found_skill) / 100
                        if similarity > 0.80:  # Lowered from 0.85
                            best_match = max(best_match, similarity * 0.95)  # Increased from 0.9
            
            matched_weight += weight * best_match
        
        if total_weight == 0:
            return 100.0
        
        score = (matched_weight / total_weight) * 100
        
        # Smart boosting for good matches (but not poor ones)
        # This helps well-matched candidates get realistic scores
        if score >= 70:
            # Excellent match - boost slightly to reach 85-95%
            score = min(95, score * 1.10)
        elif score >= 50:
            # Good match - boost to reach 65-85%
            score = score * 1.15
        elif score >= 30:
            # Fair match - small boost to reach 35-60%
            score = score * 1.05
        # Poor matches (<30%) get NO boost - stay low
        
        return round(score, 2)
    
    def compute_experience_score(self, years: float, required_years: float = 3.0) -> float:
        """Compute experience score"""
        if years is None or years < 0:
            return 0.0
        
        if years >= required_years * 1.5:
            return 100.0
        elif years >= required_years:
            return 80.0 + ((years - required_years) / (required_years * 0.5)) * 20
        else:
            return (years / required_years) * 80
    
    def compute_education_score(self, education_list) -> float:
        """
        Compute education score
        Accepts both List[str] (old format) and List[Dict] (new format)
        """
        if not education_list:
            return 50.0
        
        education_weights = {
            'phd': 100, 'doctorate': 100,
            'master': 90, 'mba': 90, 'm.tech': 90, 'ms': 90,
            'bachelor': 75, 'b.tech': 75, 'b.e': 75, 'bs': 75,
            'diploma': 60,
            'certification': 50
        }
        
        max_score = 0
        for degree in education_list:
            # Handle both dict (new format) and string (old format)
            if isinstance(degree, dict):
                degree_text = degree.get('degree', '') + ' ' + degree.get('specialization', '')
            else:
                degree_text = str(degree)
            
            degree_lower = degree_text.lower()
            for key, score in education_weights.items():
                if key in degree_lower:
                    max_score = max(max_score, score)
                    break
        
        return max_score if max_score > 0 else 50.0
    
    def calculate_final_score(
        self,
        semantic_score: float,
        skill_match_score: float,
        experience_score: float,
        education_score: float
    ) -> float:
        """Calculate weighted final score with ChatGPT-style calibration"""
        raw_score = (
            semantic_score * settings.SEMANTIC_SCORE_WEIGHT +
            skill_match_score * settings.SKILL_MATCH_WEIGHT +
            experience_score * settings.EXPERIENCE_WEIGHT +
            education_score * settings.EDUCATION_WEIGHT
        )
        
        # CHATGPT-STYLE FINAL BOOST: Push good scores higher
        if raw_score >= 75:
            # Excellent candidates: boost to 85-95% range
            final_score = 75 + (raw_score - 75) * 0.8
        elif raw_score >= 60:
            # Good candidates: boost to 70-85% range
            final_score = 60 + (raw_score - 60) * 1.0
        elif raw_score >= 40:
            # Fair candidates: slight boost to 45-70% range
            final_score = 40 + (raw_score - 40) * 1.1
        else:
            # Poor matches: keep low
            final_score = raw_score
        
        return round(min(98, final_score), 2)  # Cap at 98% like ChatGPT
    
    def rank_candidates(self, candidates: List[Dict]) -> List[Dict]:
        """Rank candidates by final score"""
        return sorted(candidates, key=lambda x: x.get('final_score', 0), reverse=True)


# Singleton instance
_enhanced_ml_engine = None


def get_enhanced_ml_engine(use_custom: bool = False) -> EnhancedMLEngine:
    """Get or create enhanced ML engine singleton"""
    global _enhanced_ml_engine
    if _enhanced_ml_engine is None:
        _enhanced_ml_engine = EnhancedMLEngine(use_custom_model=use_custom)
    return _enhanced_ml_engine
