"""
Model Training Script
Train and fine-tune the ML model for resume screening
"""

import json
import numpy as np
from pathlib import Path
import sys

# Add project root to path
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from backend.core.config import settings
from backend.core.ml_engine_enhanced import get_enhanced_ml_engine


def load_training_data():
    """Load training data from files"""
    training_file = settings.TRAINING_DATA_DIR / 'training_data.json'
    
    if not training_file.exists():
        print(f"Training data not found at {training_file}")
        print("Run prepare_dataset.py first")
        return None
    
    with open(training_file, 'r') as f:
        data = json.load(f)
    
    return data


def evaluate_model(ml_engine, test_data):
    """
    Evaluate model performance on test data
    
    Args:
        ml_engine: ML engine instance
        test_data: Test dataset
    """
    print("\n=== Model Evaluation ===")
    
    job_descriptions = test_data['job_descriptions']
    resumes = test_data['resumes']
    
    total_error = 0
    predictions = []
    
    for resume in resumes:
        # Find matching job description
        job = next((j for j in job_descriptions if j['id'] == resume['matched_job_id']), None)
        if not job:
            continue
        
        # Create mock text for testing
        resume_text = f"Skills: {', '.join(resume['skills'])}. Experience: {resume['experience_years']} years. Education: {', '.join(resume['education'])}"
        job_text = job['description']
        
        # Calculate scores
        semantic_score = ml_engine.compute_semantic_similarity(resume_text, job_text)
        skill_match_score = ml_engine.compute_skill_match_score(resume['skills'], job['required_skills'])
        experience_score = ml_engine.compute_experience_score(resume['experience_years'], job['experience_years'])
        education_score = ml_engine.compute_education_score(resume['education'])
        
        final_score = ml_engine.calculate_final_score(
            semantic_score, skill_match_score, experience_score, education_score
        )
        
        expected_score = resume.get('expected_score', 0)
        error = abs(final_score - expected_score)
        total_error += error
        
        predictions.append({
            'resume_id': resume['id'],
            'name': resume['name'],
            'predicted_score': final_score,
            'expected_score': expected_score,
            'error': error
        })
        
        print(f"\nResume: {resume['name']}")
        print(f"  Predicted: {final_score:.2f}")
        print(f"  Expected: {expected_score:.2f}")
        print(f"  Error: {error:.2f}")
    
    if predictions:
        mean_error = total_error / len(predictions)
        print(f"\n=== Overall Performance ===")
        print(f"Mean Absolute Error: {mean_error:.2f}")
        print(f"Evaluated {len(predictions)} resumes")
    
    return predictions


def save_evaluation_results(predictions, output_file):
    """Save evaluation results to file"""
    import pandas as pd
    output_path = settings.TRAINING_DATA_DIR / output_file
    with open(output_path, 'w') as f:
        json.dump({
            'predictions': predictions,
            'timestamp': str(pd.Timestamp.now())
        }, f, indent=2)
    print(f"\nResults saved to: {output_path}")


def main():
    """Main training function"""
    print("=== Resume Screening AI - Model Training ===\n")
    
    # Load training data
    print("Loading training data...")
    training_data = load_training_data()
    
    if not training_data:
        return
    
    print(f"Loaded {len(training_data['job_descriptions'])} job descriptions")
    print(f"Loaded {len(training_data['resumes'])} resumes")
    
    # Initialize ML engine
    print("\nInitializing ML engine...")
    ml_engine = get_enhanced_ml_engine(use_custom=True)
    print("ML engine initialized")
    
    # Evaluate model
    predictions = evaluate_model(ml_engine, training_data)
    
    # Save results
    if predictions:
        import pandas as pd
        save_evaluation_results(predictions, 'evaluation_results.json')
    
    print("\n=== Training Complete ===")
    print("\nNote: This is a basic evaluation. For production:")
    print("1. Collect more diverse training data")
    print("2. Implement cross-validation")
    print("3. Fine-tune model weights")
    print("4. Add more evaluation metrics")


if __name__ == "__main__":
    main()
