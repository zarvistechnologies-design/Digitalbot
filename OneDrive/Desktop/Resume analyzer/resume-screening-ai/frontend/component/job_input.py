"""
Job Description Input Component
Handles job description input with templates
"""

import streamlit as st

def render_job_input():
    """Render job description input component"""
    
    # Sample templates
    templates = {
        "Select a template...": "",
        "Senior Python Developer": """
We are seeking a Senior Python Developer with 5+ years of experience.

Required Skills:
- Python, Django/Flask
- REST API development
- PostgreSQL, MongoDB
- AWS or Azure
- Docker, Kubernetes
- Git, CI/CD

Responsibilities:
- Design and develop scalable backend systems
- Lead technical projects
- Mentor junior developers
- Write clean, maintainable code
        """,
        "Data Scientist": """
Looking for an experienced Data Scientist to join our AI team.

Required Skills:
- Python, R
- Machine Learning, Deep Learning
- TensorFlow, PyTorch, Scikit-learn
- SQL, NoSQL databases
- Data visualization (Matplotlib, Plotly)
- Statistical analysis

Experience:
- 3+ years in data science
- ML model deployment
- Big data processing
        """,
    }
    
    st.markdown("""
        <div class="info-box">
            💡 <b>Tip:</b> Be specific about required skills and experience for better matching
        </div>
    """, unsafe_allow_html=True)
    
    # Template selector
    selected_template = st.selectbox(
        "Quick Templates (Optional)",
        options=list(templates.keys()),
        help="Choose a template to start with"
    )
    
    # Job description text area
    job_description = st.text_area(
        "Job Description",
        value=templates[selected_template],
        height=300,
        placeholder="Paste or type the job description here...",
        help="Enter the complete job description"
    )
    
    # Character count
    if job_description:
        char_count = len(job_description)
        if char_count < 100:
            st.warning(f"⚠️ Job description is too short ({char_count} chars).")
        else:
            st.success(f"✅ Job description: {char_count} characters")
    
    return job_description