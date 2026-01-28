# Verify Installation Script
# Run this to check if all dependencies are installed correctly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Dependency Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$packages = @(
    "fastapi",
    "uvicorn",
    "pydantic",
    "pydantic-settings",
    "sqlalchemy",
    "sentence-transformers",
    "torch",
    "PyPDF2",
    "python-docx",
    "pandas",
    "requests",
    "pytest"
)

$allInstalled = $true

foreach ($package in $packages) {
    Write-Host "Checking $package..." -NoNewline
    $result = python -c "import importlib; importlib.import_module('$($package.Replace('-', '_'))')" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host " ✓" -ForegroundColor Green
    } else {
        Write-Host " ✗ NOT INSTALLED" -ForegroundColor Red
        $allInstalled = $false
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

if ($allInstalled) {
    Write-Host "✓ All dependencies installed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "You can now run:" -ForegroundColor Yellow
    Write-Host "  python start_backend.py" -ForegroundColor White
} else {
    Write-Host "✗ Some dependencies are missing" -ForegroundColor Red
    Write-Host ""
    Write-Host "Run the following to install:" -ForegroundColor Yellow
    Write-Host "  pip install -r requirements.txt" -ForegroundColor White
}

Write-Host ""
