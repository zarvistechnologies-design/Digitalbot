"""
Individual Candidate Card Component
Displays detailed information for a single candidate
"""

import streamlit as st

def render_candidate_card(candidate, rank):
    """
    Render a detailed card for a single candidate
    
    Args:
        candidate: Dictionary containing candidate information
        rank: Candidate's rank in the results
    """
    
    # Determine card color based on score
    score = candidate['final_score']
    if score >= 80:
        border_color = "#10B981"  # Green
        badge_color = "#ECFDF5"
        status = "🌟 Highly Recommended"
    elif score >= 60:
        border_color = "#F59E0B"  # Orange
        badge_color = "#FEF3C7"
        status = "✅ Recommended"
    else:
        border_color = "#EF4444"  # Red
        badge_color = "#FEE2E2"
        status = "⚠️ Review Required"
    
    # Card HTML
    st.markdown(f"""
        <div style="
            border: 2px solid {border_color};
            border-radius: 10px;
            padding: 20px;
            margin: 10px 0;
            background-color: white;
        ">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin: 0; color: #1F2937;">
                        #{rank} - {candidate.get('name', 'Unknown')}
                    </h3>
                    <p style="margin: 5px 0; color: #6B7280;">
                        📧 {candidate.get('email', 'N/A')} | 📱 {candidate.get('phone', 'N/A')}
                    </p>
                </div>
                <div style="
                    background-color: {badge_color};
                    padding: 10px 20px;
                    border-radius: 20px;
                    font-weight: bold;
                ">
                    {status}
                </div>
            </div>
        </div>
    """, unsafe_allow_html=True)
    
    # Metrics in columns
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="📊 Final Score",
            value=f"{score:.1f}%",
            delta=f"{score - 70:.1f}% from threshold" if score >= 70 else None
        )
    
    with col2:
        st.metric(
            label="🎯 Skills Match",
            value=f"{candidate.get('skill_match_score', 0):.1f}%"
        )
    
    with col3:
        st.metric(
            label="🧠 Semantic",
            value=f"{candidate.get('semantic_score', 0):.1f}%"
        )
    
    with col4:
        st.metric(
            label="💼 Experience",
            value=f"{candidate.get('experience_years', 0)} yrs"
        )
    
    # Expandable details
    with st.expander("🔍 View Detailed Analysis"):
        render_detailed_analysis(candidate)

def render_detailed_analysis(candidate):
    """Render detailed analysis section"""
    
    tab1, tab2, tab3 = st.tabs(["📋 Profile", "🎯 Skills", "📊 Scores"])
    
    # Tab 1: Profile
    with tab1:
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### Personal Information")
            st.write(f"**Name:** {candidate.get('name', 'Unknown')}")
            st.write(f"**Email:** {candidate.get('email', 'N/A')}")
            st.write(f"**Phone:** {candidate.get('phone', 'N/A')}")
            st.write(f"**Resume File:** {candidate.get('filename', 'N/A')}")
        
        with col2:
            st.markdown("#### Professional Background")
            st.write(f"**Experience:** {candidate.get('experience_years', 0)} years")
            
            education = candidate.get('education', [])
            if education:
                st.write(f"**Education:** {', '.join(education)}")
            else:
                st.write("**Education:** Not specified")
    
    # Tab 2: Skills
    with tab2:
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("#### ✅ Skills Found")
            skills_found = candidate.get('skills_found', [])
            
            if skills_found:
                # Categorize skills
                tech_skills = [s for s in skills_found if s in get_technical_skills()]
                soft_skills = [s for s in skills_found if s in get_soft_skills()]
                
                if tech_skills:
                    st.markdown("**Technical:**")
                    for skill in tech_skills[:15]:
                        st.markdown(f"- {skill}")
                    if len(tech_skills) > 15:
                        st.info(f"+ {len(tech_skills) - 15} more")
                
                if soft_skills:
                    st.markdown("**Soft Skills:**")
                    for skill in soft_skills:
                        st.markdown(f"- {skill}")
            else:
                st.info("No skills extracted")
        
        with col2:
            st.markdown("#### ❌ Missing Skills")
            missing_skills = candidate.get('missing_skills', [])
            
            if missing_skills:
                for skill in missing_skills[:15]:
                    st.markdown(f"- {skill}")
                if len(missing_skills) > 15:
                    st.info(f"+ {len(missing_skills) - 15} more")
            else:
                st.success("✅ All required skills found!")
        
        # Skills summary
        st.markdown("---")
        total_required = len(skills_found) + len(missing_skills)
        if total_required > 0:
            match_percentage = (len(skills_found) / total_required) * 100
            st.progress(match_percentage / 100)
            st.write(f"**Skill Coverage:** {len(skills_found)}/{total_required} skills ({match_percentage:.1f}%)")
    
    # Tab 3: Scores
    with tab3:
        st.markdown("#### Score Breakdown")
        
        scores = {
            'Skill Match (40% weight)': candidate.get('skill_match_score', 0),
            'Semantic Similarity (35% weight)': candidate.get('semantic_score', 0),
            'Experience Match (25% weight)': candidate.get('experience_score', 0)
        }
        
        for label, score in scores.items():
            st.write(f"**{label}**")
            st.progress(score / 100)
            st.write(f"{score:.1f}%")
            st.markdown("")
        
        # Final calculation
        st.markdown("---")
        st.markdown("#### Final Score Calculation")
        final = candidate['final_score']
        
        st.code(f"""
Final Score = (Skill × 0.40) + (Semantic × 0.35) + (Experience × 0.25)
            = ({scores['Skill Match (40% weight)']:.1f} × 0.40) + ({scores['Semantic Similarity (35% weight)']:.1f} × 0.35) + ({scores['Experience Match (25% weight)']:.1f} × 0.25)
            = {final:.1f}%
        """)
        
        # Recommendation
        if final >= 80:
            st.success("🌟 **Strong Match** - Highly recommended for interview")
        elif final >= 70:
            st.info("✅ **Good Match** - Recommended for interview")
        elif final >= 60:
            st.warning("⚠️ **Moderate Match** - Consider for interview")
        else:
            st.error("❌ **Weak Match** - May not meet requirements")

def get_technical_skills():
    """Return set of technical skills for categorization"""
    return {
        'python', 'java', 'javascript', 'react', 'angular', 'node.js',
        'django', 'flask', 'sql', 'mongodb', 'aws', 'azure', 'docker',
        'kubernetes', 'git', 'machine learning', 'deep learning', 'ai'
    }

def get_soft_skills():
    """Return set of soft skills for categorization"""
    return {
        'leadership', 'communication', 'teamwork', 'problem solving',
        'critical thinking', 'time management', 'adaptability'
    }