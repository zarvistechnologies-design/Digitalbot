"""
File Upload Component
Handles resume file uploads with validation
"""

import streamlit as st

def render_uploader():
    """Render file uploader component"""
    
    st.markdown("""
        <div class="info-box">
            ✨ <b>UPLOAD MULTIPLE RESUMES AT ONCE!</b><br><br>
            📌 <b>Supported formats:</b> PDF, DOCX<br>
            📌 <b>Max size:</b> 10 MB per file<br>
            📌 <b>Max files:</b> 50 resumes<br><br>
            💡 <b>Tip:</b> Hold Ctrl (Windows) or Cmd (Mac) to select multiple files!
        </div>
    """, unsafe_allow_html=True)
    
    st.markdown("")
    
    uploaded_files = st.file_uploader(
        "📁 SELECT MULTIPLE RESUME FILES (Use Ctrl+Click or Cmd+Click)",
        type=['pdf', 'docx'],
        accept_multiple_files=True,
        help="You can select multiple files at once! Hold Ctrl (Windows) or Cmd (Mac) and click to select multiple resumes.",
        label_visibility="visible"
    )
    
    if uploaded_files:
        st.success(f"✅ **{len(uploaded_files)} files selected!**")
        
        # Show list of uploaded files
        with st.expander("📋 View uploaded files", expanded=False):
            for i, file in enumerate(uploaded_files, 1):
                file_size_mb = file.size / (1024 * 1024)
                st.write(f"{i}. **{file.name}** ({file_size_mb:.2f} MB)")
        
        # Validate file sizes
        large_files = [f for f in uploaded_files if f.size > 10 * 1024 * 1024]
        if large_files:
            st.warning(f"⚠️ {len(large_files)} files exceed 10 MB limit and will be skipped")
            uploaded_files = [f for f in uploaded_files if f.size <= 10 * 1024 * 1024]
        
        # Validate file count
        if len(uploaded_files) > 50:
            st.warning("⚠️ Maximum 50 files allowed. Only first 50 will be processed.")
            uploaded_files = uploaded_files[:50]
    else:
        st.info("👆 Click 'Browse files' and select multiple resumes using Ctrl+Click (Windows) or Cmd+Click (Mac)")
    
    return uploaded_files