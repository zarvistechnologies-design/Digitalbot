"""
Upload Page - Streamlit Multi-page App
This is an alternative page structure if you want separate pages
"""

import streamlit as st
import sys
from pathlib import Path

# --- FIX: Correctly add the Project Root to sys.path ---
# Since upload.py is inside 'frontend/pages/', we go up two levels ('.parent.parent') 
# to reach the Project Root.
root_dir = Path(__file__).parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))
# --------------------------------------------------------

# Correct imports based on your folder structure
from frontend.component.uploader import render_uploader
from frontend.component.job_input import render_job_input
from frontend.utils.api_client import APIClient

st.set_page_config(page_title="Upload Resumes", page_icon="📤", layout="wide")

st.title("📤 Upload Resumes & Job Description")

st.markdown("""
Welcome to the Resume Screening System! Follow these steps:

1. **Upload candidate resumes** (PDF or DOCX format)
2. **Enter or paste the job description**
3. **Click 'Process' to analyze all candidates**
""")

st.markdown("---")

# Initialize session state variables
if 'uploaded_files' not in st.session_state:
    st.session_state['uploaded_files'] = None
if 'job_description' not in st.session_state:
    st.session_state['job_description'] = ""
if 'ready_to_process' not in st.session_state:
    st.session_state['ready_to_process'] = False


# Upload section
col1, col2 = st.columns(2)

with col1:
    st.header("📄 Upload Resumes")
    new_uploaded_files = render_uploader()
    
    if new_uploaded_files:
        st.session_state['uploaded_files'] = new_uploaded_files
        st.success(f"✅ {len(new_uploaded_files)} resumes uploaded successfully!")

with col2:
    st.header("💼 Job Description")
    new_job_description = render_job_input()
    
    if new_job_description:
        st.session_state['job_description'] = new_job_description
        st.success("✅ Job description added!")


# Process button
if st.session_state['uploaded_files'] and st.session_state['job_description']:
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("🚀 Process & Analyze Resumes", use_container_width=True, type="primary"):
            with st.spinner("🔄 Processing resumes... This may take a few moments..."):
                # Initialize API client
                api_client = APIClient(base_url="http://localhost:8000")
                
                # Process resumes
                results = api_client.process_resumes(
                    st.session_state['uploaded_files'],
                    st.session_state['job_description']
                )
                
                if results:
                    st.session_state['results'] = results
                    st.session_state['uploaded_files_count'] = len(results)
                    st.session_state['ready_to_process'] = True
                    st.success(f"✅ Successfully processed {len(results)} resumes!")
                    st.balloons()
                    st.info("👉 Go to the **Results** page to see the ranked candidates!")
                else:
                    st.error("❌ Failed to process resumes. Please check if the backend is running.")