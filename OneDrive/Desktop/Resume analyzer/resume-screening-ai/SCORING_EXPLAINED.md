# How the Resume Scoring Works (No Training Required!)

## 🎯 Overview
The system uses a **pre-trained AI model** called **Sentence Transformers** that already understands language, so you don't need to train it with your own data!

---

## 📊 Scoring Components (4 Parts)

### The final score is calculated from 4 components with different weights:

```
Final Score = (Semantic Score × 40%) + 
              (Skill Match × 35%) + 
              (Experience × 15%) + 
              (Education × 10%)
```

---

## 1️⃣ Semantic Similarity Score (40% Weight)

### What it does:
Compares the **meaning** of the resume with the job description using AI

### How it works:
```python
# Uses Pre-trained Model: "all-MiniLM-L6-v2"
# This model was trained on MILLIONS of sentences to understand language

Resume: "5 years Python developer, built REST APIs, worked with databases"
Job Description: "Looking for Python developer with API and database experience"

# The AI converts both texts into mathematical vectors (embeddings)
resume_vector = [0.23, 0.45, 0.12, ...] (384 numbers)
job_vector = [0.25, 0.43, 0.15, ...] (384 numbers)

# Then calculates cosine similarity (how similar the vectors are)
similarity = cosine_similarity(resume_vector, job_vector)
# Result: 0.85 → 85% semantic match!
```

### Example Scores:
- 90-100%: Excellent match (very similar meaning)
- 70-89%: Good match (related content)
- 50-69%: Moderate match (some overlap)
- Below 50%: Poor match (different topics)

---

## 2️⃣ Skill Match Score (35% Weight)

### What it does:
Counts how many **required skills** the candidate has

### How it works:
```python
# Job Description mentions:
Required Skills: ["Python", "FastAPI", "SQL", "Docker", "REST API"]

# Resume contains:
Found Skills: ["Python", "FastAPI", "SQL", "JavaScript"]

# Calculate match:
Matches = 3 out of 5 required skills
Score = (3 / 5) × 100 = 60%
```

### Skill Extraction:
Uses **pattern matching** on a database of 100+ technical skills:

```json
{
  "Programming Languages": ["Python", "JavaScript", "Java", "C++", ...],
  "Frameworks": ["FastAPI", "Django", "React", "Angular", ...],
  "Databases": ["PostgreSQL", "MongoDB", "MySQL", ...],
  "Cloud": ["AWS", "Azure", "Google Cloud", ...],
  "Tools": ["Docker", "Kubernetes", "Git", ...]
}
```

### Example:
- Job requires: Python, Django, PostgreSQL, AWS (4 skills)
- Resume has: Python, Django, PostgreSQL (3 skills)
- Score: 3/4 = **75%**

---

## 3️⃣ Experience Score (15% Weight)

### What it does:
Evaluates years of work experience

### How it works:
```python
# Extract experience from resume:
"5+ years of experience in software development"
→ Extracted: 5 years

# Scoring logic:
if years >= 4.5:      # 1.5× required (3 years)
    score = 100%
elif years >= 3:      # Meets requirement
    score = 80-100%
else:                 # Below requirement
    score = (years/3) × 80%
```

### Example Scores:
- 0 years: 0%
- 1 year: 27%
- 2 years: 53%
- 3 years: 80%
- 4 years: 93%
- 5+ years: 100%

---

## 4️⃣ Education Score (10% Weight)

### What it does:
Scores based on educational qualifications

### How it works:
```python
# Resume mentions: "Bachelor of Technology in Computer Science"
→ Detected: "Bachelor", "B.Tech"
→ Score: 75%

# Education weights:
PhD/Doctorate: 100%
Master's/MBA/M.Tech: 90%
Bachelor's/B.Tech: 75%
Diploma: 60%
Certification: 50%
None found: 50% (default)
```

### Example:
- Resume: "MBA from IIM" → **90%**
- Resume: "B.Tech Computer Science" → **75%**
- Resume: "12th Pass" → **50%** (default)

---

## 🧮 Complete Scoring Example

### Job Description:
```
"Looking for Senior Python Developer with 3+ years experience.
Must know: Python, FastAPI, PostgreSQL, Docker, REST APIs.
Bachelor's degree required."
```

### Candidate Resume:
```
"Software Engineer with 5 years experience.
Skills: Python, FastAPI, SQL, JavaScript, Docker, Git
Education: B.Tech Computer Science"
```

### Calculation:

#### 1. Semantic Similarity (40%):
```
AI compares resume meaning with job description
→ Result: 82%
→ Weighted: 82% × 0.40 = 32.8
```

#### 2. Skill Match (35%):
```
Required: Python, FastAPI, PostgreSQL, Docker, REST
Found: Python, FastAPI, Docker (SQL/PostgreSQL counted as match)
→ Result: 4/5 = 80%
→ Weighted: 80% × 0.35 = 28.0
```

#### 3. Experience (15%):
```
Candidate has 5 years (requirement: 3 years)
→ Result: 100%
→ Weighted: 100% × 0.15 = 15.0
```

#### 4. Education (10%):
```
B.Tech degree found
→ Result: 75%
→ Weighted: 75% × 0.10 = 7.5
```

### **Final Score:**
```
32.8 + 28.0 + 15.0 + 7.5 = 83.3%
```

**Rank: Good Match** ✅

---

## 🤖 Why No Training Needed?

### 1. **Pre-trained Model (Sentence Transformers)**
- Already trained on 1+ billion sentence pairs
- Understands semantic meaning of text
- Works out of the box for any domain

### 2. **Rule-based Components**
- Skill matching: Pattern matching (no ML needed)
- Experience scoring: Simple math formulas
- Education scoring: Predefined weights

### 3. **Domain-agnostic**
- Works for ANY job type (developer, marketing, sales, etc.)
- Doesn't need examples of your specific job descriptions
- Universal understanding of language

---

## 📈 Adjusting Weights

You can change the importance of each component in `backend/core/config.py`:

```python
# Current weights:
SEMANTIC_SCORE_WEIGHT: float = 0.4   # 40% - Meaning match
SKILL_MATCH_WEIGHT: float = 0.35     # 35% - Skills
EXPERIENCE_WEIGHT: float = 0.15      # 15% - Years
EDUCATION_WEIGHT: float = 0.10       # 10% - Degree

# Example: Make skills more important:
SEMANTIC_SCORE_WEIGHT: float = 0.3   # 30%
SKILL_MATCH_WEIGHT: float = 0.50     # 50% ← Increased!
EXPERIENCE_WEIGHT: float = 0.15      # 15%
EDUCATION_WEIGHT: float = 0.05       # 5%
```

---

## 🔍 Model Details

### Sentence Transformer: all-MiniLM-L6-v2

**Specifications:**
- Size: ~80 MB
- Speed: ~2000 sentences/second
- Vector dimension: 384
- Training data: 1+ billion sentence pairs
- Performance: 82% accuracy on semantic similarity tasks

**What it's good at:**
✅ Understanding context and meaning
✅ Finding similar documents
✅ Semantic search
✅ Comparing job descriptions with resumes

**Downloaded automatically** on first run, no manual setup needed!

---

## 🎓 Summary

| Component | Weight | Based On | Training Needed? |
|-----------|--------|----------|------------------|
| Semantic Match | 40% | Pre-trained AI | ❌ No |
| Skill Match | 35% | Pattern matching | ❌ No |
| Experience | 15% | Math formulas | ❌ No |
| Education | 10% | Predefined rules | ❌ No |

**Total training required: ZERO!** 🎉

The system is **ready to use** with any job description and any resume right away!
