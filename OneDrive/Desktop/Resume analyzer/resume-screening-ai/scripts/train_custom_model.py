"""
Training Script for Custom ML Model
Fine-tune the model on your own resume-job matching data
"""

import sys
from pathlib import Path
import json
import argparse

# Add project root to path
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from backend.core.ml_engine_enhanced import EnhancedMLEngine
from backend.core.config import settings


def create_sample_training_data():
    """
    Create sample training data file
    You should replace this with real labeled data
    """
    sample_data = [
        {
            "resume": "Senior Python Developer with 5 years experience. Expert in Django, FastAPI, PostgreSQL. Built scalable REST APIs. Strong problem-solving skills.",
            "job_description": "Looking for Senior Python Developer. Must have Django/FastAPI experience. Database knowledge required. 4+ years experience.",
            "score": 0.92  # High match (0-1 scale)
        },
        {
            "resume": "Junior JavaScript developer, 1 year experience. Knows React and Node.js. Fresh graduate.",
            "job_description": "Senior Python Developer with 5+ years experience. Django expert needed.",
            "score": 0.15  # Low match
        },
        {
            "resume": "Full-stack developer. 3 years Python, Django, React. PostgreSQL, Docker experience. Built multiple web applications.",
            "job_description": "Full-stack developer needed. Python backend, React frontend. Database and Docker knowledge required.",
            "score": 0.88  # Good match
        },
        {
            "resume": "Data Scientist with ML expertise. Python, TensorFlow, scikit-learn. 4 years experience in NLP and computer vision.",
            "job_description": "Web developer position. PHP, WordPress, MySQL. No Python required.",
            "score": 0.25  # Poor match
        },
        {
            "resume": "Python automation engineer. 6 years experience. Expert in FastAPI, async programming, Redis, RabbitMQ. DevOps experience.",
            "job_description": "Backend Python developer. FastAPI required. Message queues experience preferred. 5+ years.",
            "score": 0.85  # Good match
        }
    ]
    
    # Save to training data directory
    training_file = settings.TRAINING_DATA_DIR / "training_data.json"
    with open(training_file, 'w', encoding='utf-8') as f:
        json.dump(sample_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Sample training data created: {training_file}")
    print(f"   Total samples: {len(sample_data)}")
    print("\n📝 Edit this file to add your own labeled data!")
    print("   Format: resume + job_description + score (0-1)")
    return str(training_file)


def train_model(
    training_file: str,
    validation_file: str = None,
    epochs: int = 4,
    batch_size: int = 16
):
    """
    Train custom model
    
    Args:
        training_file: Path to training data JSON
        validation_file: Optional validation data
        epochs: Number of training epochs
        batch_size: Batch size
    """
    print("=" * 60)
    print("🚀 Starting Custom Model Training")
    print("=" * 60)
    
    # Initialize engine with base model
    engine = EnhancedMLEngine(use_custom_model=False)
    
    print(f"\n📊 Training Configuration:")
    print(f"   Training file: {training_file}")
    print(f"   Validation file: {validation_file or 'None'}")
    print(f"   Epochs: {epochs}")
    print(f"   Batch size: {batch_size}")
    print(f"   Base model: {settings.MODEL_NAME}")
    print()
    
    # Train
    metadata = engine.train_custom_model(
        training_file=training_file,
        validation_file=validation_file,
        epochs=epochs,
        batch_size=batch_size
    )
    
    print("\n" + "=" * 60)
    print("✅ Training Complete!")
    print("=" * 60)
    print(f"\n📈 Training Results:")
    print(f"   Trained samples: {metadata['training_samples']}")
    print(f"   Epochs: {metadata['epochs']}")
    print(f"   Model saved to: {engine.custom_model_path}")
    print(f"\n💡 To use the custom model, set USE_CUSTOM_MODEL=True in config")


def main():
    parser = argparse.ArgumentParser(description="Train custom resume screening model")
    parser.add_argument(
        '--create-sample',
        action='store_true',
        help='Create sample training data file'
    )
    parser.add_argument(
        '--train',
        type=str,
        help='Path to training data JSON file'
    )
    parser.add_argument(
        '--validation',
        type=str,
        help='Path to validation data JSON file (optional)'
    )
    parser.add_argument(
        '--epochs',
        type=int,
        default=4,
        help='Number of training epochs (default: 4)'
    )
    parser.add_argument(
        '--batch-size',
        type=int,
        default=16,
        help='Training batch size (default: 16)'
    )
    
    args = parser.parse_args()
    
    if args.create_sample:
        training_file = create_sample_training_data()
        print(f"\n💡 To train the model, run:")
        print(f"   python scripts/train_custom_model.py --train {training_file}")
    elif args.train:
        train_model(
            training_file=args.train,
            validation_file=args.validation,
            epochs=args.epochs,
            batch_size=args.batch_size
        )
    else:
        parser.print_help()
        print("\n" + "=" * 60)
        print("📚 Quick Start:")
        print("=" * 60)
        print("\n1. Create sample training data:")
        print("   python scripts/train_custom_model.py --create-sample")
        print("\n2. Edit the training data file with your own labeled examples")
        print("\n3. Train the model:")
        print("   python scripts/train_custom_model.py --train data/training/training_data.json")
        print("\n4. Use the custom model by setting USE_CUSTOM_MODEL=True")


if __name__ == "__main__":
    main()
