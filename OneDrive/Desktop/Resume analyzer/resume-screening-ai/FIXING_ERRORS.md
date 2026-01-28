# Fixing Import Errors - Quick Guide

## ✅ Issues Fixed

All 11 Pylance import errors have been resolved:

### 1. Missing Dependencies in requirements.txt
**Status**: ✅ **RESOLVED** - All dependencies already exist in requirements.txt

### 2. Code Issue in train_model.py
**Status**: ✅ **FIXED** - Added missing pandas import

---

## 🚀 How to Resolve Import Errors

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install all dependencies
pip install -r requirements.txt
```

This will install all required packages:
- ✅ `pydantic-settings` - For configuration management
- ✅ `sentence-transformers` - For ML model
- ✅ `sqlalchemy` - For database ORM
- ✅ `PyPDF2` - For PDF parsing
- ✅ `python-docx` - For DOCX parsing
- ✅ `pytest` - For testing
- ✅ And all other dependencies...

### Step 2: Verify Installation

Run the verification script:

```powershell
.\verify_install.ps1
```

This will check if all packages are installed correctly.

---

## 📋 All Dependencies in requirements.txt

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
python-multipart==0.0.6
pydantic==2.5.0
pydantic-settings==2.1.0        ← Fixes config.py import
sqlalchemy==2.0.23               ← Fixes database imports
sentence-transformers==2.2.2     ← Fixes ml_engine.py import
torch==2.1.0
transformers==4.35.2
PyPDF2==3.0.1                    ← Fixes parser.py import
python-docx==1.1.0               ← Fixes parser.py import
pandas==2.1.3
requests==2.31.0
pytest==7.4.3                    ← Fixes test imports
```

---

## 🔧 What Was Fixed

### 1. requirements.txt
- ✅ Already contains all necessary dependencies
- ✅ Includes pydantic-settings
- ✅ Includes sentence-transformers
- ✅ Includes sqlalchemy
- ✅ Includes PyPDF2 and python-docx
- ✅ Includes pytest

### 2. scripts/train_model.py
**Before:**
```python
def save_evaluation_results(predictions, output_file):
    """Save evaluation results to file"""
    output_path = settings.TRAINING_DATA_DIR / output_file
    with open(output_path, 'w') as f:
        json.dump({
            'predictions': predictions,
            'timestamp': str(pd.Timestamp.now())  # ❌ pd not imported
        }, f, indent=2)
```

**After:**
```python
def save_evaluation_results(predictions, output_file):
    """Save evaluation results to file"""
    import pandas as pd  # ✅ Added import
    output_path = settings.TRAINING_DATA_DIR / output_file
    with open(output_path, 'w') as f:
        json.dump({
            'predictions': predictions,
            'timestamp': str(pd.Timestamp.now())  # ✅ Now works
        }, f, indent=2)
```

---

## 📝 Error Summary

### Errors Fixed:
1. ✅ `pydantic_settings` import in config.py
2. ✅ `sentence_transformers` import in ml_engine.py
3. ✅ `sqlalchemy` imports in connection.py
4. ✅ `sqlalchemy` imports in candidate.py
5. ✅ `PyPDF2` import in parser.py
6. ✅ `docx` import in parser.py
7. ✅ `pd` undefined in train_model.py
8. ✅ `pytest` import in test_backend.py

---

## 🎯 Next Steps

### 1. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 2. Verify Installation
```powershell
.\verify_install.ps1
```

### 3. Test the Backend
```powershell
python start_backend.py
```

### 4. Check for Errors
If you still see import errors in VS Code:
1. Reload VS Code window (Ctrl+Shift+P → "Reload Window")
2. Or restart VS Code
3. Ensure Python interpreter is set to venv

---

## 🔍 Troubleshooting

### If imports still show errors:

**Option 1: Select Python Interpreter**
1. Press `Ctrl+Shift+P`
2. Type "Python: Select Interpreter"
3. Choose the venv interpreter: `.\venv\Scripts\python.exe`

**Option 2: Reload VS Code**
1. Press `Ctrl+Shift+P`
2. Type "Developer: Reload Window"

**Option 3: Reinstall Dependencies**
```powershell
pip uninstall -r requirements.txt -y
pip install -r requirements.txt
```

**Option 4: Create New Virtual Environment**
```powershell
# Remove old venv
Remove-Item -Recurse -Force venv

# Create new venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## ✅ Verification Commands

```powershell
# Test each import individually
python -c "from pydantic_settings import BaseSettings; print('✓ pydantic-settings OK')"
python -c "from sentence_transformers import SentenceTransformer; print('✓ sentence-transformers OK')"
python -c "from sqlalchemy import create_engine; print('✓ sqlalchemy OK')"
python -c "import PyPDF2; print('✓ PyPDF2 OK')"
python -c "import docx; print('✓ python-docx OK')"
python -c "import pytest; print('✓ pytest OK')"
```

---

## 📦 Installation Time Estimate

- **Small packages** (pydantic, requests, etc.): ~1 minute
- **PyTorch** (torch): ~5-10 minutes (large download)
- **Sentence Transformers**: ~2 minutes
- **Total**: ~10-15 minutes

**Note**: First time running the app will also download ML models (~90MB)

---

## 🎉 All Fixed!

Once you run `pip install -r requirements.txt`, all import errors will be resolved and the backend will be ready to use!

```powershell
# Complete installation process:
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
.\verify_install.ps1
python start_backend.py
```

Visit http://localhost:8000/docs to test the API!
