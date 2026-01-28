"""
Results Display Component
Shows ranked candidates in a table format
"""

import streamlit as st
import pandas as pd

def render_results(results):
    """Render results table with candidate rankings"""
    
    st.markdown("### 🏆 Ranked Candidates")
    
    if not results:
        st.info("No results to display")
        return
    
    # Sort by final score
    sorted_results = sorted(results, key=lambda x: x['final_score'], reverse=True)
    
    # Summary metrics
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Total Candidates", len(results))
    
    with col2:
        top_scorer = sorted_results[0]
        st.metric("Top Score", f"{top_scorer['final_score']:.1f}%")
    
    with col3:
        avg_score = sum(r['final_score'] for r in results) / len(results)
        st.metric("Average Score", f"{avg_score:.1f}%")
    
    with col4:
        qualified = len([r for r in results if r['final_score'] >= 70])
        st.metric("Qualified (70%+)", qualified)
    
    st.markdown("---")
    
    # Create DataFrame
    df_data = []
    for idx, candidate in enumerate(sorted_results, 1):
        df_data.append({
            'Rank': idx,
            'Name': candidate.get('name', 'Unknown'),
            'Email': candidate.get('email', 'N/A'),
            'Final Score': f"{candidate['final_score']:.1f}%",
        })
    
    df = pd.DataFrame(df_data)
    st.dataframe(df, use_container_width=True)