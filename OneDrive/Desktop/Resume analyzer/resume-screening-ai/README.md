# Resume Screening AI - Backend System

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

An intelligent AI-powered resume screening and candidate ranking system built with FastAPI, Sentence Transformers, and advanced NLP techniques.

## 🚀 Features

- **Semantic Similarity Analysis**: Uses sentence transformers to compute semantic similarity between resumes and job descriptions
- **Skill Matching**: Automatically extracts and matches technical skills
- **Experience Scoring**: Evaluates candidate experience levels
- **Education Analysis**: Assesses educational qualifications
- **Contact Extraction**: Automatically extracts name, email, phone, and experience from resumes
- **Multi-format Support**: Handles PDF and DOCX resume formats
- **RESTful API**: Complete API with FastAPI for easy integration
- **Ranking System**: Weighted scoring algorithm to rank candidates
- **Database Storage**: SQLite database for storing candidate information
- **Training Pipeline**: Scripts for dataset preparation and model training

## 📁 Project Structure

```
resume-screening-ai/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── api/
│   │   └── routes.py          # API endpoints
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   └── ml_engine.py       # ML model and scoring logic
│   ├── database/
│   │   └── connection.py      # Database connection
│   ├── models/
│   │   └── candidate.py       # SQLAlchemy models
│   ├── schemas/
│   │   ├── resume.py          # Request/response schemas
│   │   └── response.py        # Additional schemas
│   └── utils/
│       ├── parser.py          # Resume text extraction
│       ├── skill_extractor.py # Skill extraction
│       └── contact_extractor.py # Contact info extraction
├── data/
│   ├── resumes/               # Store resume files
│   ├── job_descriptions/      # Store job descriptions
│   ├── processed/             # Processed data
│   ├── skills/                # Skills database
│   └── training/              # Training datasets
├── scripts/
│   ├── prepare_dataset.py     # Prepare training data
│   └── train_model.py         # Train/evaluate model
├── frontend/                  # Streamlit frontend
├── models/                    # Trained models cache
├── logs/                      # Application logs
├── temp/                      # Temporary uploads
├── requirements.txt           # Python dependencies
└── README.md                  # This file
```

## 🛠️ Installation

### Prerequisites

- Python 3.9 or higher
- pip package manager
- 4GB+ RAM (for ML models)

### Setup Steps

1. **Clone or navigate to the repository**
```powershell
cd "C:\Users\sumit\OneDrive\Desktop\Resume analyzer\resume-screening-ai"
```

2. **Create virtual environment**
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

3. **Install dependencies**
```powershell
pip install -r requirements.txt
```

4. **Initialize the system**
```powershell
python -c "from backend.database.connection import init_db; init_db()"
```

5. **Prepare training data (optional)**
```powershell
python scripts/prepare_dataset.py
```

## 🚀 Running the Backend

### Start the FastAPI server

```powershell
# Development mode with auto-reload
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Run with Python directly

```powershell
python backend/main.py
```

## 📡 API Endpoints

### Health Check
```http
GET /health
```
Check if the API is running.

### Process Resumes
```http
POST /api/v1/process
Content-Type: multipart/form-data

Parameters:
- resumes: List of files (PDF/DOCX)
- job_description: string
```
Process resumes against a job description and return ranked candidates.

**Response Example:**
```json
{
  "success": true,
  "message": "Successfully processed 3 resumes",
  "total_candidates": 3,
  "processing_time": 2.45,
  "results": [
    {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1-234-567-8900",
      "filename": "john_doe_resume.pdf",
      "final_score": 87.5,
      "semantic_score": 90.0,
      "skill_match_score": 85.0,
      "experience_score": 88.0,
      "education_score": 87.0,
      "experience_years": 6,
      "education": ["B.Tech", "M.Tech"],
      "skills_found": ["python", "django", "aws", "docker"],
      "missing_skills": ["kubernetes"]
    }
  ]
}
```

### Extract Skills
```http
POST /api/v1/extract-skills
Content-Type: application/x-www-form-urlencoded

Parameters:
- text: string
```
Extract skills from any text.

### Get All Skills
```http
GET /api/v1/skills/all
```
Get all skills in the database.

### Initialize System
```http
POST /api/v1/initialize
```
Initialize database and system.

## 🧮 Scoring Algorithm

The system uses a weighted scoring algorithm:

```python
Final Score = (Semantic Score × 0.4) + 
              (Skill Match × 0.35) + 
              (Experience × 0.15) + 
              (Education × 0.10)
```

### Score Components:

1. **Semantic Score (40%)**: Measures overall contextual similarity between resume and job description using sentence transformers
2. **Skill Match (35%)**: Percentage of required skills found in resume
3. **Experience Score (15%)**: Based on years of experience relative to requirements
4. **Education Score (10%)**: Based on highest qualification level

## 📊 Training & Fine-tuning

### Prepare Training Dataset
```powershell
python scripts/prepare_dataset.py
```

This creates:
- `data/training/training_data.json` - Main training dataset
- `data/training/job_descriptions.csv` - Job descriptions
- `data/training/resumes.csv` - Resume data
- `data/training/annotation_template.json` - Template for manual annotation

### Train/Evaluate Model
```powershell
python scripts/train_model.py
```

This evaluates the model on the training dataset and reports performance metrics.

## 🔧 Configuration

Edit `backend/core/config.py` to customize:

- **Model Settings**: Change the sentence transformer model
- **Scoring Weights**: Adjust weight percentages
- **File Limits**: Max file size and number of files
- **Database**: Change database URL (SQLite to PostgreSQL)

### Environment Variables

Create a `.env` file in the project root:

```env
# Server
HOST=0.0.0.0
PORT=8000
DEBUG=True

# Model
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2

# Database
DATABASE_URL=sqlite:///resume_screening.db

# Logging
LOG_LEVEL=INFO
```

## 🧪 Testing

### Manual Testing with curl

```powershell
# Health check
curl http://localhost:8000/health

# Test processing (PowerShell)
$form = @{
    resumes = Get-Item "path\to\resume.pdf"
    job_description = "Looking for Python developer with 3+ years experience..."
}
Invoke-RestMethod -Uri "http://localhost:8000/api/v1/process" -Method Post -Form $form
```

### Using the API Documentation

Navigate to http://localhost:8000/docs for interactive API testing via Swagger UI.

## 📦 Data Folders

The system automatically creates these folders:

- **data/resumes/** - Store uploaded resumes
- **data/job_descriptions/** - Store job descriptions
- **data/processed/** - Processed/cleaned data
- **data/skills/** - Skills database (JSON)
- **data/training/** - Training datasets
- **models/sentence-transformer/** - Cached ML models
- **logs/** - Application logs
- **temp/uploads/** - Temporary file uploads

## 🔍 Skills Database

The system includes a comprehensive skills database covering:

- Programming Languages (Python, Java, JavaScript, etc.)
- Web Technologies (React, Django, Flask, etc.)
- Databases (MySQL, PostgreSQL, MongoDB, etc.)
- Cloud & DevOps (AWS, Azure, Docker, Kubernetes, etc.)
- Data Science & ML (TensorFlow, PyTorch, Pandas, etc.)
- Tools & Frameworks

Skills are automatically saved to `data/skills/tech_skills.json` and can be extended.

## 🤝 Integration with Frontend

The backend is designed to work with the Streamlit frontend. Start both:

```powershell
# Terminal 1: Backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2: Frontend
streamlit run frontend/app.py
```

## 🐛 Troubleshooting

### Issue: Import errors
**Solution**: Ensure you're in the project root and virtual environment is activated.

### Issue: Model download fails
**Solution**: Check internet connection. Models are downloaded on first run (~90MB).

### Issue: File parsing errors
**Solution**: Ensure resume files are valid PDF or DOCX format, not scanned images.

### Issue: CORS errors
**Solution**: Check `ALLOWED_ORIGINS` in `backend/core/config.py`.

## 📈 Performance

- **Processing Speed**: ~1-2 seconds per resume
- **Batch Processing**: Up to 50 resumes at once
- **Model Size**: ~90MB (all-MiniLM-L6-v2)
- **Memory Usage**: ~500MB-1GB during processing

## 🔒 Security Considerations

- Input validation on all endpoints
- File size and type restrictions
- Temporary file cleanup
- SQL injection protection via SQLAlchemy ORM
- CORS configuration for production

## 🚀 Production Deployment

### Using Docker (Recommended)

Create `Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```powershell
docker build -t resume-screening-ai .
docker run -p 8000:8000 resume-screening-ai
```

### Environment Setup

For production:
1. Set `DEBUG=False`
2. Use PostgreSQL instead of SQLite
3. Configure proper CORS origins
4. Set up logging
5. Use a reverse proxy (nginx)
6. Enable HTTPS

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📧 Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API docs at `/docs`

## 🙏 Acknowledgments

- **Sentence Transformers** - For semantic similarity
- **FastAPI** - For the web framework
- **Streamlit** - For the frontend
- **Hugging Face** - For pre-trained models

---

**Built with ❤️ for intelligent recruitment**
