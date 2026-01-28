# Quick Reference Guide

## Installation & Setup

```powershell
# 1. Setup (first time only)
.\setup.ps1

# 2. Activate virtual environment
.\venv\Scripts\Activate.ps1

# 3. Start backend
.\run.ps1
# OR
uvicorn backend.main:app --reload
# OR
python start_backend.py
```

## URLs
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## API Endpoints

### Process Resumes
```bash
POST /api/v1/process
- resumes: file[] (PDF/DOCX)
- job_description: string
```

### Extract Skills
```bash
POST /api/v1/extract-skills
- text: string
```

### Get All Skills
```bash
GET /api/v1/skills/all
```

### Health Check
```bash
GET /health
```

## Common Commands

### Development
```powershell
# Activate environment
.\venv\Scripts\Activate.ps1

# Install new package
pip install package-name
pip freeze > requirements.txt

# Run tests
pytest tests/

# Check code
python -m pylint backend/
```

### Database
```powershell
# Initialize database
python -c "from backend.database.connection import init_db; init_db()"

# View database
sqlite3 resume_screening.db
```

### Training
```powershell
# Prepare dataset
python scripts/prepare_dataset.py

# Train/evaluate model
python scripts/train_model.py
```

## Configuration

### Edit Settings
File: `backend/core/config.py`

### Environment Variables
File: `.env`

```env
DEBUG=True
HOST=0.0.0.0
PORT=8000
MODEL_NAME=sentence-transformers/all-MiniLM-L6-v2
DATABASE_URL=sqlite:///resume_screening.db
```

## Scoring Weights

Default weights in `config.py`:
- Semantic Score: 40%
- Skill Match: 35%
- Experience: 15%
- Education: 10%

## File Locations

### Important Files
- Main app: `backend/main.py`
- Routes: `backend/api/routes.py`
- ML engine: `backend/core/ml_engine.py`
- Config: `backend/core/config.py`

### Data Directories
- Resumes: `data/resumes/`
- Skills DB: `data/skills/tech_skills.json`
- Training: `data/training/`
- Logs: `logs/app.log`
- Temp uploads: `temp/uploads/`

## Troubleshooting

### Backend won't start
```powershell
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt

# Check for errors
python backend/main.py
```

### Import errors
```powershell
# From project root
$env:PYTHONPATH = (Get-Location).Path
python backend/main.py
```

### Model download fails
- Check internet connection
- Model downloads on first run (~90MB)
- Cached in `models/sentence-transformer/`

### Port already in use
```powershell
# Use different port
uvicorn backend.main:app --port 8001

# OR kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

## Testing

### Quick Test
```powershell
# Health check
curl http://localhost:8000/health

# OR
Invoke-RestMethod http://localhost:8000/health
```

### Test with sample data
Visit: http://localhost:8000/docs
Click "Try it out" on `/api/v1/process`

## Skills Database

### Location
`data/skills/tech_skills.json`

### Add New Skill
Edit the JSON file or use the API (future feature)

### Current Skills Count
100+ technical skills across:
- Programming languages
- Frameworks
- Databases
- Cloud platforms
- Tools

## Docker

### Build & Run
```powershell
# Build
docker build -t resume-screening-ai .

# Run
docker run -p 8000:8000 resume-screening-ai

# Docker Compose
docker-compose up -d
docker-compose down
```

## Logs

### View Logs
```powershell
# Application logs
Get-Content logs/app.log -Tail 50 -Wait

# Uvicorn logs
# Shown in console when running
```

## Performance

### Expected Processing Times
- Single resume: 1-2 seconds
- 10 resumes: 10-15 seconds
- 50 resumes: 50-75 seconds

### Memory Usage
- Idle: ~200MB
- Processing: ~500MB-1GB

## Backup & Recovery

### Backup Database
```powershell
Copy-Item resume_screening.db resume_screening_backup.db
```

### Backup Configuration
```powershell
Copy-Item .env .env.backup
```

## Updates

### Update Dependencies
```powershell
pip install --upgrade -r requirements.txt
```

### Update Skills Database
Edit: `data/skills/tech_skills.json`

## Production Checklist

Before deploying to production:
- [ ] Set `DEBUG=False` in .env
- [ ] Use PostgreSQL instead of SQLite
- [ ] Configure proper CORS origins
- [ ] Set up HTTPS/SSL
- [ ] Add authentication
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up rate limiting
- [ ] Review security settings
- [ ] Test with production data

## Support

### Documentation
- Main README: `README.md`
- API Docs: `docs/API.md`
- Backend Overview: `docs/BACKEND_OVERVIEW.md`
- Interactive API: http://localhost:8000/docs

### Common Issues
1. **Import errors**: Check PYTHONPATH
2. **Model not found**: Wait for download
3. **Port in use**: Change port or kill process
4. **File parsing error**: Check file format
5. **Memory issues**: Reduce batch size

## Useful Links

- FastAPI Docs: https://fastapi.tiangolo.com/
- Sentence Transformers: https://www.sbert.net/
- SQLAlchemy: https://www.sqlalchemy.org/
- Pydantic: https://docs.pydantic.dev/

---

**Quick Start**: `.\setup.ps1` → `.\run.ps1` → Open http://localhost:8000/docs

**Support**: Check logs, documentation, or create GitHub issue
