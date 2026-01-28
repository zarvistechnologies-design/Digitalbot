"""
Data Visualization Component
Charts and graphs for analytics
"""

import streamlit as st
import plotly.graph_objects as go

def render_charts(results):
    """Render various charts and visualizations"""
    
    st.markdown("### 📈 Analytics Dashboard")
    
    if not results:
        st.info("No data to visualize")
        return
    
    # Sort by score
    sorted_results = sorted(results, key=lambda x: x['final_score'], reverse=True)
    
    # Score Distribution
    scores = [r['final_score'] for r in results]
    
    fig = go.Figure(data=[go.Histogram(
        x=scores,
        nbinsx=20,
        marker_color='#2563EB',
        opacity=0.7
    )])
    
    fig.update_layout(
        xaxis_title="Score (%)",
        yaxis_title="Number of Candidates",
        height=400
    )
    
    st.plotly_chart(fig, use_container_width=True)