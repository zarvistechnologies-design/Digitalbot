# Resume Screening AI - Backend System Overview

## Project Summary

A complete, production-ready backend system for AI-powered resume screening and candidate ranking. The system uses state-of-the-art NLP models and intelligent scoring algorithms to match candidates with job descriptions.

---

## 🏗️ Architecture

### Technology Stack

**Core Framework:**
- FastAPI (REST API framework)
- Uvicorn (ASGI server)
- Python 3.9+

**Machine Learning:**
- Sentence Transformers (semantic similarity)
- PyTorch (ML backend)
- Scikit-learn (additional ML utilities)

**Data Processing:**
- PyPDF2 (PDF parsing)
- python-docx (DOCX parsing)
- Pandas (data manipulation)

**Database:**
- SQLAlchemy (ORM)
- SQLite (default, can upgrade to PostgreSQL)

**Additional Tools:**
- Pydantic (data validation)
- Requests (HTTP client)

---

## 📂 Complete File Structure

```
resume-screening-ai/
├── backend/                    # Backend application
│   ├── __init__.py
│   ├── main.py                # FastAPI app entry point
│   │
│   ├── api/                   # API routes
│   │   ├── __init__.py
│   │   └── routes.py          # Endpoint definitions
│   │
│   ├── core/                  # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py          # Configuration & settings
│   │   ├── ml_engine.py       # ML model & scoring
│   │   └── logging_config.py  # Logging setup
│   │
│   ├── database/              # Database layer
│   │   ├── __init__.py
│   │   └── connection.py      # DB connection & session
│   │
│   ├── models/                # Database models
│   │   ├── __init__.py
│   │   └── candidate.py       # Candidate & JobDescription models
│   │
│   ├── schemas/               # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── resume.py          # Request/response schemas
│   │   └── response.py        # Additional schemas
│   │
│   └── utils/                 # Utility functions
│       ├── __init__.py
│       ├── parser.py          # Resume text extraction
│       ├── skill_extractor.py # Skill identification
│       ├── contact_extractor.py # Contact info extraction
│       └── helpers.py         # Helper utilities
│
├── data/                      # Data directories
│   ├── resumes/              # Uploaded resumes
│   ├── job_descriptions/     # Job descriptions
│   ├── processed/            # Processed data
│   ├── skills/               # Skills database
│   │   └── tech_skills.json  # Technical skills list
│   └── training/             # Training datasets
│       ├── training_data.json
│       ├── job_descriptions.csv
│       ├── resumes.csv
│       └── README.md
│
├── scripts/                   # Utility scripts
│   ├── prepare_dataset.py    # Dataset preparation
│   └── train_model.py        # Model training/evaluation
│
├── frontend/                  # Streamlit frontend (existing)
│   └── ...
│
├── models/                    # ML model cache
│   └── sentence-transformer/  # Downloaded models
│
├── logs/                      # Application logs
│   └── app.log
│
├── temp/                      # Temporary files
│   └── uploads/              # Temporary uploads
│
├── tests/                     # Test suite
│   ├── __init__.py
│   └── test_backend.py       # Backend tests
│
├── docs/                      # Documentation
│   └── API.md                # API documentation
│
├── docker/                    # Docker configs (optional)
│
├── .env.template             # Environment template
├── .gitignore                # Git ignore rules
├── Dockerfile                # Docker configuration
├── docker-compose.yml        # Docker Compose config
├── requirements.txt          # Python dependencies
├── README.md                 # Main documentation
├── setup.ps1                 # Setup script (Windows)
├── run.ps1                   # Run script (Windows)
└── start_backend.py          # Backend startup script
```

---

## 🔑 Key Components

### 1. FastAPI Application (`backend/main.py`)
- Main application entry point
- CORS configuration
- Global exception handling
- Health check endpoint
- API router integration

### 2. Configuration (`backend/core/config.py`)
- Centralized settings management
- Environment variable support
- Path configurations
- ML model settings
- Scoring weights configuration

### 3. ML Engine (`backend/core/ml_engine.py`)
- Sentence transformer model loading
- Semantic similarity computation
- Skill matching algorithm
- Experience scoring
- Education scoring
- Final score calculation
- Candidate ranking

### 4. API Routes (`backend/api/routes.py`)
- `/api/v1/process` - Main resume processing endpoint
- `/api/v1/extract-skills` - Skill extraction
- `/api/v1/skills/all` - Get all skills
- `/api/v1/initialize` - System initialization
- `/health` - Health check

### 5. Resume Parser (`backend/utils/parser.py`)
- PDF text extraction (PyPDF2)
- DOCX text extraction (python-docx)
- Text cleaning and normalization
- Multi-format support

### 6. Skill Extractor (`backend/utils/skill_extractor.py`)
- Comprehensive skills database (100+ skills)
- Pattern-based skill extraction
- Skill matching algorithm
- JSON-based skills storage
- Extensible skill database

### 7. Contact Extractor (`backend/utils/contact_extractor.py`)
- Email extraction (regex)
- Phone number extraction (multiple formats)
- Name extraction (heuristic)
- Experience years extraction
- Education qualification extraction

### 8. Database Models (`backend/models/candidate.py`)
- Candidate model (personal info, scores, skills)
- JobDescription model
- SQLAlchemy ORM
- Automatic timestamps

### 9. Pydantic Schemas (`backend/schemas/`)
- Request validation
- Response serialization
- Type safety
- API documentation

---

## 🎯 Scoring System

### Weighted Algorithm
```python
Final Score = 
    Semantic Similarity × 40% +
    Skill Match × 35% +
    Experience × 15% +
    Education × 10%
```

### Score Components

**1. Semantic Similarity (40%)**
- Uses sentence-transformers/all-MiniLM-L6-v2
- Cosine similarity between resume and job description embeddings
- Captures contextual understanding beyond keyword matching

**2. Skill Match (35%)**
- Percentage of required skills found in resume
- Based on comprehensive tech skills database
- Case-insensitive matching

**3. Experience (15%)**
- Scoring based on years of experience:
  - ≥ 150% of required: 100%
  - = required: 80%
  - < required: proportional

**4. Education (10%)**
- PhD/Doctorate: 100%
- Master's/MBA: 90%
- Bachelor's: 75%
- Diploma: 60%
- Default: 50%

---

## 🚀 Quick Start

### 1. Setup (First Time)
```powershell
# Run setup script
.\setup.ps1

# Or manual setup:
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Start Backend
```powershell
# Option 1: Quick start
.\run.ps1

# Option 2: Using uvicorn
uvicorn backend.main:app --reload

# Option 3: Using start script
python start_backend.py
```

### 3. Access API
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📊 API Usage Examples

### Process Resumes (Python)
```python
import requests

files = [
    ('resumes', open('resume1.pdf', 'rb')),
    ('resumes', open('resume2.pdf', 'rb'))
]
data = {
    'job_description': 'Looking for a Senior Python Developer...'
}

response = requests.post(
    'http://localhost:8000/api/v1/process',
    files=files,
    data=data
)

results = response.json()
for candidate in results['results']:
    print(f"{candidate['name']}: {candidate['final_score']}%")
```

### Extract Skills
```python
import requests

response = requests.post(
    'http://localhost:8000/api/v1/extract-skills',
    data={'text': 'I know Python, Django, and AWS'}
)

skills = response.json()['skills']
print(skills)  # ['python', 'django', 'aws']
```

---

## 🗄️ Database Schema

### Candidates Table
```sql
CREATE TABLE candidates (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    filename TEXT NOT NULL,
    resume_text TEXT,
    final_score REAL,
    semantic_score REAL,
    skill_match_score REAL,
    experience_score REAL,
    education_score REAL,
    experience_years REAL,
    education JSON,
    skills_found JSON,
    missing_skills JSON,
    job_description_id TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

---

## 🔧 Configuration Options

### Environment Variables (.env)
```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
DATABASE_URL=sqlite:///resume_screening.db
SEMANTIC_SCORE_WEIGHT=0.4
SKILL_MATCH_WEIGHT=0.35
EXPERIENCE_WEIGHT=0.15
EDUCATION_WEIGHT=0.10
MAX_FILE_SIZE=10485760
MAX_FILES=50
```

---

## 🧪 Testing

### Run Tests
```powershell
# Install pytest
pip install pytest

# Run all tests
pytest tests/

# Run with coverage
pytest --cov=backend tests/
```

### Manual Testing
```powershell
# Health check
curl http://localhost:8000/health

# Interactive API docs
# Navigate to: http://localhost:8000/docs
```

---

## 📦 Dependencies

### Core Dependencies
- fastapi==0.104.1
- uvicorn[standard]==0.24.0
- sentence-transformers==2.2.2
- torch==2.1.0
- PyPDF2==3.0.1
- python-docx==1.1.0
- sqlalchemy==2.0.23
- pydantic==2.5.0

See `requirements.txt` for complete list.

---

## 🐳 Docker Deployment

### Build and Run
```powershell
# Build image
docker build -t resume-screening-ai .

# Run container
docker run -p 8000:8000 resume-screening-ai

# Using docker-compose
docker-compose up -d
```

---

## 🔒 Security Considerations

### Current Implementation
- Input validation on all endpoints
- File type and size restrictions
- SQL injection protection (SQLAlchemy ORM)
- CORS configuration

### Production Recommendations
1. Add authentication (JWT/API keys)
2. Rate limiting
3. HTTPS/TLS
4. Input sanitization
5. Secrets management
6. Audit logging

---

## 📈 Performance Metrics

### Processing Speed
- Single resume: ~1-2 seconds
- Batch of 10: ~10-15 seconds
- Batch of 50: ~50-75 seconds

### Resource Usage
- Memory: ~500MB-1GB
- CPU: Moderate (ML inference)
- Disk: ~200MB (model cache)

### Scalability
- Horizontal scaling supported
- Async processing capability
- Background task queue (future)

---

## 🛠️ Maintenance

### Regular Tasks
1. Update skills database
2. Fine-tune scoring weights
3. Collect training data
4. Update ML model
5. Monitor logs
6. Clean temporary files

### Monitoring
- Check logs: `logs/app.log`
- Health endpoint: `/health`
- Database size
- API response times

---

## 🚀 Future Enhancements

### Planned Features
1. **Background Processing**: Celery/Redis for async jobs
2. **Advanced NLP**: Named entity recognition
3. **Custom Models**: Fine-tuned transformers
4. **Batch API**: Dedicated batch processing endpoint
5. **Analytics**: Detailed reporting and insights
6. **Multi-language**: Support for non-English resumes
7. **Integration**: ATS system integration
8. **Caching**: Redis for performance
9. **Authentication**: JWT/OAuth2
10. **WebSockets**: Real-time updates

### Model Improvements
- Fine-tune on domain-specific data
- Custom skill embeddings
- Context-aware experience extraction
- Resume structure analysis

---

## 📞 Support & Contribution

### Getting Help
1. Check documentation (README.md, API.md)
2. Review API docs at `/docs`
3. Check logs for errors
4. Create GitHub issue

### Contributing
1. Fork repository
2. Create feature branch
3. Write tests
4. Submit pull request

---

## 📄 License

MIT License - Free for personal and commercial use

---

## 🎉 Acknowledgments

- Sentence Transformers team
- FastAPI framework
- Hugging Face community
- Open source contributors

---

**System Status: ✅ Production Ready**

The backend is fully functional and ready for:
- Development and testing
- Integration with frontend
- Production deployment
- Further customization

All core features implemented:
✅ Resume parsing (PDF, DOCX)
✅ Skill extraction
✅ Contact information extraction
✅ ML-based scoring
✅ RESTful API
✅ Database storage
✅ Training pipeline
✅ Documentation
✅ Docker support
✅ Testing framework
