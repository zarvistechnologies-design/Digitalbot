"""
Results Page - Display processed results
"""

import streamlit as st
import sys
from pathlib import Path

# FIXED: Changed _file_ to __file__ (double underscores)
sys.path.append(str(Path(__file__).parent.parent.parent))

# CORRECTED IMPORT - Changed 'components' to 'component' (singular)
from frontend.component.results_table import render_results
from frontend.utils.api_client import APIClient

st.set_page_config(page_title="Results", page_icon="📊", layout="wide")

st.title("📊 Candidate Rankings & Results")

# Check if results are available
if 'results' in st.session_state and st.session_state.results:
    results = st.session_state.results
    
    # Summary metrics at the top
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="Total Candidates",
            value=len(results)
        )
    
    with col2:
        avg_score = sum(r.get('final_score', 0) for r in results) / len(results) if results else 0
        st.metric(
            label="Average Score",
            value=f"{avg_score:.1f}%"
        )
    
    with col3:
        qualified = len([r for r in results if r.get('final_score', 0) >= 70])
        st.metric(
            label="Qualified (≥70%)",
            value=qualified
        )
    
    with col4:
        top_score = max(r.get('final_score', 0) for r in results) if results else 0
        st.metric(
            label="Top Score",
            value=f"{top_score:.1f}%"
        )
    
    st.markdown("---")
    
    # Render results table
    render_results(st.session_state.results)
    
else:
    st.info("👈 No results yet. Upload resumes and process them first!")
    
    st.markdown("---")
    
    # Show sample data option
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button("📝 Load Sample Data (Demo)", use_container_width=True, type="primary"):
            # Load sample results for demonstration
            sample_results = [
                {
                    'name': 'John Doe',
                    'email': 'john.doe@email.com',
                    'phone': '+1-234-567-8900',
                    'experience_years': 6,
                    'education': ['B.Tech', 'M.Tech'],
                    'final_score': 87.5,
                    'skill_match_score': 85.0,
                    'semantic_score': 90.0,
                    'experience_score': 88.0,
                    'skills_found': ['python', 'django', 'aws', 'docker', 'postgresql'],
                    'missing_skills': ['kubernetes'],
                    'filename': 'john_doe_resume.pdf'
                },
                {
                    'name': 'Jane Smith',
                    'email': 'jane.smith@email.com',
                    'phone': '+1-234-567-8901',
                    'experience_years': 4,
                    'education': ['B.S. Computer Science'],
                    'final_score': 78.3,
                    'skill_match_score': 75.0,
                    'semantic_score': 82.0,
                    'experience_score': 78.0,
                    'skills_found': ['python', 'flask', 'mongodb', 'git'],
                    'missing_skills': ['aws', 'docker', 'kubernetes'],
                    'filename': 'jane_smith_resume.pdf'
                },
                {
                    'name': 'Mike Johnson',
                    'email': 'mike.j@email.com',
                    'phone': '+1-234-567-8902',
                    'experience_years': 8,
                    'education': ['B.E.', 'MBA'],
                    'final_score': 92.1,
                    'skill_match_score': 95.0,
                    'semantic_score': 88.0,
                    'experience_score': 93.0,
                    'skills_found': ['python', 'django', 'flask', 'aws', 'docker', 'kubernetes', 'postgresql'],
                    'missing_skills': [],
                    'filename': 'mike_johnson_resume.pdf'
                }
            ]
            
            st.session_state.results = sample_results
            st.success("✅ Sample data loaded successfully!")
            st.rerun()
    
    st.markdown("---")
    
    # Show what will be displayed
    st.markdown("### What you'll see here:")
    st.markdown("""
    - 🏆 **Ranked Candidates** - All candidates sorted by match score
    - 📊 **Score Breakdown** - Detailed scoring metrics for each candidate
    - 💼 **Skills Analysis** - Matched and missing skills comparison
    - 📧 **Contact Information** - Email and phone details
    - 📄 **Resume Details** - Experience, education, and qualifications
    - 📥 **Export Options** - Download results in various formats
    """)
    
    # Sample preview
    with st.expander("📋 Preview: What the results will look like"):
        st.markdown("""
        | Rank | Name | Score | Skills Match | Experience | Key Skills |
        |------|------|-------|--------------|------------|------------|
        | 1 | Mike Johnson | 92.1% | 95.0% | 8 years | Python, Django, AWS, Docker |
        | 2 | John Doe | 87.5% | 85.0% | 6 years | Python, Django, PostgreSQL |
        | 3 | Jane Smith | 78.3% | 75.0% | 4 years | Python, Flask, MongoDB |
        """)