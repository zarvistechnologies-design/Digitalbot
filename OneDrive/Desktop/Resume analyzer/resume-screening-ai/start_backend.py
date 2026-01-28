"""
API Startup Script
Quick script to start the backend server
"""

import os
import sys
from pathlib import Path

# Add project root to path
root_dir = Path(__file__).parent
sys.path.insert(0, str(root_dir))

def main():
    """Start the FastAPI server"""
    import uvicorn
    from backend.core.config import settings
    
    print("=" * 50)
    print("🚀 Starting Resume Screening AI Backend")
    print("=" * 50)
    print(f"Host: {settings.HOST}")
    print(f"Port: {settings.PORT}")
    print(f"Debug Mode: {settings.DEBUG}")
    print(f"API Docs: http://localhost:{settings.PORT}/docs")
    print("=" * 50)
    
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )

if __name__ == "__main__":
    main()
