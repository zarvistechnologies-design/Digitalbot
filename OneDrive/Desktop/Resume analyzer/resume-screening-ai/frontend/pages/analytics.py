"""
Analytics Page - Detailed visualizations and insights
"""

import streamlit as st
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.append(str(Path(__file__).parent.parent.parent))

# CORRECTED IMPORT - Changed 'components' to 'component' (singular)
from frontend.component.visualizations import render_charts

st.set_page_config(page_title="Analytics", page_icon="📈", layout="wide")

st.title("📈 Analytics & Insights")

st.markdown("""
Comprehensive analysis of all candidates including:
- Score distributions
- Skills analysis
- Experience patterns
- Comparison metrics
""")

st.markdown("---")

# Check if results are available
if 'results' in st.session_state and st.session_state.results:
    render_charts(st.session_state.results)
    
    # Additional insights
    st.markdown("---")
    st.markdown("### 💡 Key Insights")
    
    results = st.session_state.results
    
    col1, col2, col3 = st.columns(3)
    
    with col1:
        top_scorer = max(results, key=lambda x: x.get('final_score', 0))
        st.info(f"""
        **🏆 Top Candidate**
        
        {top_scorer.get('name', 'Unknown')}
        
        Score: {top_scorer.get('final_score', 0):.1f}%
        """)
    
    with col2:
        # Safe calculation with default values - filter out None values
        exp_values = [r.get('experience_years') or 0 for r in results if r.get('experience_years') is not None]
        if not exp_values:  # If all are None, use 0
            exp_values = [0]
        avg_exp = sum(exp_values) / len(exp_values)
        min_exp = min(exp_values)
        max_exp = max(exp_values)
        
        st.info(f"""
        **💼 Average Experience**
        
        {avg_exp:.1f} years
        
        Range: {min_exp}-{max_exp} years
        """)
    
    with col3:
        qualified = len([r for r in results if r.get('final_score', 0) >= 70])
        qualified_pct = (qualified / len(results) * 100) if results else 0
        
        st.info(f"""
        **✅ Qualified Candidates**
        
        {qualified} out of {len(results)}
        
        ({qualified_pct:.1f}%)
        """)
    
    # Additional Analytics Section
    st.markdown("---")
    st.markdown("### 📊 Detailed Breakdown")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Score Distribution")
        score_ranges = {
            "Excellent (90-100%)": len([r for r in results if r.get('final_score', 0) >= 90]),
            "Good (70-89%)": len([r for r in results if 70 <= r.get('final_score', 0) < 90]),
            "Average (50-69%)": len([r for r in results if 50 <= r.get('final_score', 0) < 70]),
            "Below Average (<50%)": len([r for r in results if r.get('final_score', 0) < 50])
        }
        
        for category, count in score_ranges.items():
            percentage = (count / len(results) * 100) if results else 0
            st.write(f"**{category}**: {count} ({percentage:.1f}%)")
    
    with col2:
        st.markdown("#### Top Skills Frequency")
        # Collect all skills from results
        all_skills = {}
        for result in results:
            skills = result.get('skills', [])
            if isinstance(skills, list):
                for skill in skills:
                    skill_name = skill if isinstance(skill, str) else skill.get('name', 'Unknown')
                    all_skills[skill_name] = all_skills.get(skill_name, 0) + 1
        
        # Sort and display top 5
        if all_skills:
            top_skills = sorted(all_skills.items(), key=lambda x: x[1], reverse=True)[:5]
            for skill, count in top_skills:
                percentage = (count / len(results) * 100) if results else 0
                st.write(f"**{skill}**: {count} candidates ({percentage:.1f}%)")
        else:
            st.write("No skill data available")

else:
    st.info("👈 No data available. Process resumes first to see analytics!")
    
    # Show placeholder visualization
    st.markdown("---")
    st.markdown("### What you'll see here:")
    st.markdown("""
    - 📊 **Score Distribution Charts** - Visual breakdown of candidate scores
    - 🎯 **Skills Analysis** - Most common and in-demand skills
    - 💼 **Experience Metrics** - Experience level distribution
    - 🏆 **Top Performers** - Highest-ranked candidates
    - 📈 **Comparison Views** - Side-by-side candidate comparisons
    """)