"""
API Client for Backend Communication
"""

import requests
import streamlit as st
from typing import List, Dict, Any

class APIClient:
    """Client for communicating with the backend API"""
    
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.api_prefix = "/api/v1"
    
    def health_check(self) -> bool:
        """Check if API is running"""
        try:
            response = requests.get(f"{self.base_url}{self.api_prefix}/health", timeout=5)
            return response.status_code == 200
        except Exception as e:
            print(f"Health check failed: {e}")
            return False
    
    def process_resumes(self, uploaded_files, job_description: str) -> List[Dict[str, Any]]:
        """Send resumes to backend for processing"""
        
        files = []
        for uploaded_file in uploaded_files:
            files.append(
                ('resumes', (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type))
            )
        
        data = {'job_description': job_description}
        
        try:
            response = requests.post(
                f"{self.base_url}{self.api_prefix}/process",
                files=files,
                data=data,
                timeout=300
            )
            
            if response.status_code == 200:
                return response.json()['results']
            else:
                st.error(f"API Error: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            st.error(f"Connection Error: {str(e)}")
            return None