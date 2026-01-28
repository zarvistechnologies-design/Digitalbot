"""
Main Streamlit Application for Resume Screening System
This is the entry point for the frontend interface and serves as the dashboard.
"""

import streamlit as st
import sys
from pathlib import Path

# --- FIX: Correctly add the Project Root to sys.path ---
# Since app.py is inside 'frontend/', we go up one level ('.parent') 
# to reach the Project Root (the directory containing 'frontend').
root_dir = Path(__file__).parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))
# --------------------------------------------------------

# NOTE: The components are not needed in this file now, as the main page 
# only shows status and general info. We only need APIClient for the status check.
from frontend.utils.api_client import APIClient


# Page configuration
st.set_page_config(
    page_title="AI Resume Screening System",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS (Kept for styling consistency)
st.markdown("""
    <style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        color: #1E3A8A;
        text-align: center;
        margin-bottom: 2rem;
    }
    .sub-header {
        font-size: 1.5rem;
        color: #4B5563;
        text-align: center;
        margin-bottom: 3rem;
    }
    /* Removing .stButton styles as the main action button is gone */
    .info-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #EFF6FF;
        border-left: 4px solid #2563EB;
        margin: 1rem 0;
    }
    .success-box {
        padding: 1rem;
        border-radius: 0.5rem;
        background-color: #ECFDF5;
        border-left: 4px solid #10B981;
        margin: 1rem 0;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1.5rem;
        border-radius: 1rem;
        color: white;
        text-align: center;
    }
    </style>
""", unsafe_allow_html=True)

def initialize_session_state():
    """Initialize session state variables"""
    # Initialize only the variables that other pages will rely on
    if 'job_description' not in st.session_state:
        st.session_state.job_description = ""
    if 'results' not in st.session_state:
        st.session_state.results = None
    if 'uploaded_files_count' not in st.session_state:
        st.session_state.uploaded_files_count = 0


def main():
    """Main application function"""
    
    initialize_session_state()
    
    # Initialize API client
    api_client = APIClient(base_url="http://localhost:8000")
    
    # Header
    st.markdown('<h1 class="main-header">🤖 AI Resume Screening Dashboard</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Welcome to the Intelligent Candidate Ranking System</p>', unsafe_allow_html=True)
    
    # Main Content - Status and Guide
    
    st.header("Quick Status")
    col1, col2, col3 = st.columns(3)
    
    # --- Status Card 1: Resumes ---
    with col1:
        st.markdown(
            f'<div class="metric-card"><h3>📄 Resumes Loaded</h3><h1>{st.session_state.get("uploaded_files_count", 0)}</h1></div>',
            unsafe_allow_html=True
        )

    # --- Status Card 2: JD Status ---
    jd_status = "✅ Added" if st.session_state.job_description else "❌ Missing"
    jd_color = "#10B981" if st.session_state.job_description else "#EF4444"
    with col2:
        st.markdown(
            f'<div style="background: linear-gradient(135deg, #F97316 0%, #B45309 100%); padding: 1.5rem; border-radius: 1rem; color: white; text-align: center;"><h3>💼 Job Description</h3><h1>{jd_status}</h1></div>',
            unsafe_allow_html=True
        )
    
    # --- Status Card 3: Analysis Status ---
    analysis_status = "✅ Processed" if st.session_state.results else "⏳ Pending"
    analysis_color = "#10B981" if st.session_state.results else "#F59E0B"
    with col3:
        st.markdown(
            f'<div style="background: linear-gradient(135deg, {analysis_color} 0%, #78350F 100%); padding: 1.5rem; border-radius: 1rem; color: white; text-align: center;"><h3>📊 Analysis</h3><h1>{analysis_status}</h1></div>',
            unsafe_allow_html=True
        )

    st.markdown("---")

    st.header("Navigation Guide")
    st.markdown("""
    Use the pages in the sidebar to proceed:
    
    1. **Upload**: Go to the **Upload page** to upload candidate resumes and enter the Job Description.
    2. **Results**: After processing, go to the **Results page** to see the ranked candidate table and detailed insights.
    3. **Analytics**: Go to the **Analytics page** for visual summaries and charts.
    """)

    st.markdown("---")

    # Sidebar (Kept, as it's the main navigation/status area)
    with st.sidebar:
        st.image("https://img.icons8.com/clouds/200/resume.png", width=150)
        st.markdown("### ⚙️ System Status")
        
        # Check API status
        if api_client.health_check():
            st.success("🟢 Backend API: Online")
        else:
            st.error("🔴 Backend API: Offline")
            st.info("Start backend: `uvicorn backend.main:app --reload`")
            
        st.markdown("---")
        st.markdown("### 📈 Statistics")
        if st.session_state.results:
            st.metric("Total Candidates", len(st.session_state.results))
            # Calculate Average Score safely
            try:
                avg_score = sum(r['final_score'] for r in st.session_state.results) / len(st.session_state.results)
                st.metric("Average Score", f"{avg_score:.1f}%")
            except (ZeroDivisionError, KeyError):
                 st.metric("Average Score", "N/A")


if __name__ == "__main__":
    main()