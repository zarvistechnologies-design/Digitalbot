# Resume Screening AI - Quick Setup Script for Windows
# Run this script to set up the project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Resume Screening AI - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✓ Found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Python not found. Please install Python 3.9 or higher." -ForegroundColor Red
    exit 1
}

# Create virtual environment
Write-Host ""
Write-Host "Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path "venv") {
    Write-Host "Virtual environment already exists. Skipping..." -ForegroundColor Gray
} else {
    python -m venv venv
    Write-Host "✓ Virtual environment created" -ForegroundColor Green
}

# Activate virtual environment
Write-Host ""
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1
Write-Host "✓ Virtual environment activated" -ForegroundColor Green

# Upgrade pip
Write-Host ""
Write-Host "Upgrading pip..." -ForegroundColor Yellow
python -m pip install --upgrade pip
Write-Host "✓ Pip upgraded" -ForegroundColor Green

# Install requirements
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
Write-Host "(This may take several minutes, especially for ML libraries)" -ForegroundColor Gray
pip install -r requirements.txt
Write-Host "✓ Dependencies installed" -ForegroundColor Green

# Create .env file
Write-Host ""
Write-Host "Creating .env file..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host ".env file already exists. Skipping..." -ForegroundColor Gray
} else {
    Copy-Item ".env.template" ".env"
    Write-Host "✓ .env file created" -ForegroundColor Green
}

# Initialize database
Write-Host ""
Write-Host "Initializing database..." -ForegroundColor Yellow
python -c "from backend.database.connection import init_db; init_db()"
Write-Host "✓ Database initialized" -ForegroundColor Green

# Create training data
Write-Host ""
Write-Host "Preparing training data..." -ForegroundColor Yellow
python scripts/prepare_dataset.py
Write-Host "✓ Training data prepared" -ForegroundColor Green

# Setup complete
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the backend server, run:" -ForegroundColor Yellow
Write-Host "  python start_backend.py" -ForegroundColor White
Write-Host ""
Write-Host "Or use uvicorn directly:" -ForegroundColor Yellow
Write-Host "  uvicorn backend.main:app --reload" -ForegroundColor White
Write-Host ""
Write-Host "API Documentation will be available at:" -ForegroundColor Yellow
Write-Host "  http://localhost:8000/docs" -ForegroundColor White
Write-Host ""
Write-Host "To start the frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "  streamlit run frontend/app.py" -ForegroundColor White
Write-Host ""
