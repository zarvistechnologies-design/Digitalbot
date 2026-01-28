# Quick Start Script for Backend
# Double-click this file or run: .\run.ps1

Write-Host "Starting Resume Screening AI Backend..." -ForegroundColor Cyan

# Activate virtual environment
if (Test-Path "venv\Scripts\Activate.ps1") {
    & .\venv\Scripts\Activate.ps1
    Write-Host "✓ Virtual environment activated" -ForegroundColor Green
} else {
    Write-Host "✗ Virtual environment not found. Run setup.ps1 first." -ForegroundColor Red
    exit 1
}

# Start the backend
Write-Host ""
Write-Host "Starting FastAPI server..." -ForegroundColor Yellow
Write-Host "API will be available at: http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
Write-Host ""

python start_backend.py
