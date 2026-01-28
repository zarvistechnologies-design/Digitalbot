# API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
Currently, no authentication is required. For production, implement JWT or API key authentication.

---

## Endpoints

### 1. Health Check

Check if the API is running and healthy.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "resume-screening-ai",
  "version": "1.0.0"
}
```

**Status Codes:**
- `200 OK` - Service is healthy

---

### 2. Process Resumes

Process uploaded resumes against a job description and return ranked candidates.

**Endpoint:** `POST /api/v1/process`

**Content-Type:** `multipart/form-data`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| resumes | file[] | Yes | List of resume files (PDF or DOCX) |
| job_description | string | Yes | Job description text (min 50 characters) |

**Request Example (curl):**
```bash
curl -X POST "http://localhost:8000/api/v1/process" \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.pdf" \
  -F "job_description=Looking for a Senior Python Developer with 5+ years of experience..."
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully processed 2 resumes",
  "total_candidates": 2,
  "processing_time": 2.45,
  "results": [
    {
      "id": null,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1-234-567-8900",
      "filename": "resume1.pdf",
      "final_score": 87.5,
      "semantic_score": 90.0,
      "skill_match_score": 85.0,
      "experience_score": 88.0,
      "education_score": 87.0,
      "experience_years": 6.0,
      "education": ["B.Tech", "M.Tech"],
      "skills_found": ["python", "django", "aws", "docker", "postgresql"],
      "missing_skills": ["kubernetes"],
      "created_at": null
    },
    {
      "id": null,
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "phone": "+1-234-567-8901",
      "filename": "resume2.pdf",
      "final_score": 76.3,
      "semantic_score": 75.0,
      "skill_match_score": 70.0,
      "experience_score": 82.0,
      "education_score": 80.0,
      "experience_years": 4.0,
      "education": ["B.S."],
      "skills_found": ["python", "flask", "mongodb"],
      "missing_skills": ["aws", "docker", "kubernetes"],
      "created_at": null
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Successfully processed
- `400 Bad Request` - Invalid input (no files, description too short, too many files)
- `500 Internal Server Error` - Processing error

**Error Response:**
```json
{
  "error": "Bad Request",
  "detail": "Job description too short",
  "status_code": 400
}
```

---

### 3. Extract Skills

Extract technical skills from any text.

**Endpoint:** `POST /api/v1/extract-skills`

**Content-Type:** `application/x-www-form-urlencoded`

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | Text to extract skills from |

**Request Example:**
```bash
curl -X POST "http://localhost:8000/api/v1/extract-skills" \
  -d "text=I have experience with Python, Django, AWS, and Docker"
```

**Response:**
```json
{
  "skills": ["python", "django", "aws", "docker"],
  "total_skills": 4
}
```

**Status Codes:**
- `200 OK` - Successfully extracted
- `500 Internal Server Error` - Extraction error

---

### 4. Get All Skills

Get all skills in the system's database.

**Endpoint:** `GET /api/v1/skills/all`

**Response:**
```json
{
  "skills": [
    "angular",
    "ansible",
    "aws",
    "azure",
    "c#",
    "c++",
    "docker",
    "django",
    "flask",
    "python",
    "...additional skills..."
  ],
  "total": 87
}
```

**Status Codes:**
- `200 OK` - Successfully retrieved
- `500 Internal Server Error` - Retrieval error

---

### 5. Initialize System

Initialize the database and system components.

**Endpoint:** `POST /api/v1/initialize`

**Response:**
```json
{
  "success": true,
  "message": "System initialized successfully"
}
```

**Status Codes:**
- `200 OK` - Successfully initialized
- `500 Internal Server Error` - Initialization error

---

## Data Models

### CandidateResponse
```json
{
  "id": "integer (optional)",
  "name": "string (optional)",
  "email": "string (optional)",
  "phone": "string (optional)",
  "filename": "string",
  "final_score": "float (0-100)",
  "semantic_score": "float (0-100)",
  "skill_match_score": "float (0-100)",
  "experience_score": "float (0-100)",
  "education_score": "float (0-100)",
  "experience_years": "float (optional)",
  "education": "string[] (optional)",
  "skills_found": "string[] (optional)",
  "missing_skills": "string[] (optional)",
  "created_at": "datetime (optional)"
}
```

### ProcessResponse
```json
{
  "success": "boolean",
  "message": "string",
  "total_candidates": "integer",
  "results": "CandidateResponse[]",
  "processing_time": "float (seconds)"
}
```

---

## Scoring Algorithm

The system calculates a weighted final score for each candidate:

```
Final Score = (Semantic Score × 0.4) + 
              (Skill Match Score × 0.35) + 
              (Experience Score × 0.15) + 
              (Education Score × 0.10)
```

### Score Components:

1. **Semantic Score (40%)**
   - Measures contextual similarity between resume and job description
   - Uses sentence transformers for deep semantic understanding
   - Range: 0-100

2. **Skill Match Score (35%)**
   - Percentage of required skills found in resume
   - Formula: `(matched_skills / required_skills) × 100`
   - Range: 0-100

3. **Experience Score (15%)**
   - Based on years of experience
   - Full score (100) if experience ≥ 1.5× required years
   - Progressive scoring for lower experience
   - Range: 0-100

4. **Education Score (10%)**
   - Based on highest qualification level
   - PhD/Doctorate: 100, Master's: 90, Bachelor's: 75
   - Range: 0-100

---

## Rate Limits

Currently, no rate limits are enforced. For production:
- Implement rate limiting per IP/API key
- Suggested: 100 requests per hour per user
- Large batch processing may require higher limits

---

## File Constraints

- **Supported Formats:** PDF, DOCX
- **Max File Size:** 10 MB per file
- **Max Files per Request:** 50 files
- **Total Request Size:** Limited by server configuration

---

## Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error type",
  "detail": "Detailed error message",
  "status_code": 400
}
```

Common Error Codes:
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `422` - Unprocessable Entity (schema validation)
- `500` - Internal Server Error

---

## Interactive Documentation

FastAPI provides automatic interactive documentation:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

These interfaces allow you to:
- Test endpoints interactively
- View detailed schemas
- Generate code samples
- Download OpenAPI specification

---

## Integration Examples

### Python (requests)
```python
import requests

files = [
    ('resumes', open('resume1.pdf', 'rb')),
    ('resumes', open('resume2.pdf', 'rb'))
]
data = {'job_description': 'Looking for Python developer...'}

response = requests.post(
    'http://localhost:8000/api/v1/process',
    files=files,
    data=data
)

results = response.json()
print(f"Processed {results['total_candidates']} candidates")
```

### JavaScript (fetch)
```javascript
const formData = new FormData();
formData.append('resumes', file1);
formData.append('resumes', file2);
formData.append('job_description', 'Looking for Python developer...');

fetch('http://localhost:8000/api/v1/process', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

### cURL
```bash
curl -X POST "http://localhost:8000/api/v1/process" \
  -H "Content-Type: multipart/form-data" \
  -F "resumes=@resume1.pdf" \
  -F "resumes=@resume2.pdf" \
  -F "job_description=Looking for Python developer with 5+ years..."
```

---

## WebSocket Support

Currently not implemented. Future versions may include WebSocket support for:
- Real-time processing updates
- Progress tracking for large batches
- Live notifications

---

## Versioning

API version is included in the URL path: `/api/v1/`

Future versions will maintain backward compatibility when possible.

---

## Support

For API issues:
1. Check the interactive documentation at `/docs`
2. Review error messages for details
3. Check application logs
4. Create an issue on GitHub
