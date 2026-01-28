"""
Streamlit Theme Configuration
"""

def get_theme_config():
    """Return custom theme configuration"""
    return {
        "primaryColor": "#667eea",
        "backgroundColor": "#f8fafc",
        "secondaryBackgroundColor": "#ffffff",
        "textColor": "#1f2937",
        "font": "sans serif"
    }

def apply_custom_css():
    """Apply custom CSS styling"""
    import streamlit as st
    
    st.markdown("""
        <style>
        /* Import custom styles */
        @import url('styles/main.css');
        
        /* Additional inline styles */
        .stApp {
            background: linear-gradient(180deg, #f8fafc 0%, #e5e7eb 100%);
        }
        
        /* Smooth animations */
        * {
            transition: all 0.3s ease;
        }
        </style>
    """, unsafe_allow_html=True)