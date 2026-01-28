# Troubleshooting Guide

## "Could not extract text from PDF" Error

### Problem
The backend shows: `Could not extract text from @Cv Anshika Rathore.pdf`

### Cause
Your PDF is likely **image-based** (scanned) rather than text-based. The current parser only works with text-based PDFs.

### Solutions

#### Option 1: Use Text-Based PDFs (Recommended)
1. Open your resume in Word/Google Docs
2. Save/Export as PDF
3. Upload the new PDF file

#### Option 2: Convert Your PDF
Use online tools to convert your PDF:
- https://www.ilovepdf.com/pdf_to_word
- Convert to Word → Edit → Save as new PDF

#### Option 3: Add OCR Support
Install OCR libraries to handle scanned PDFs:

```bash
pip install pytesseract pdf2image pillow
```

Then download Tesseract OCR:
- Windows: https://github.com/UB-Mannheim/tesseract/wiki
- After installation, add to PATH

### Quick Test
To check if your PDF is text-based:
1. Open the PDF
2. Try to select and copy text
3. If you can't select text → it's image-based (scanned)
4. If you can select text → it's text-based (should work)

## Backend Not Running

### Check Backend Status
```bash
curl http://localhost:8000/health
```

### Restart Backend
```bash
cd "C:\Users\sumit\OneDrive\Desktop\Resume analyzer\resume-screening-ai"
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```

## Connection Errors

### Error: "Connection refused"
- Backend is not running
- Check if port 8000 is available
- Try restarting the backend

### Error: "Timeout"
- Backend is processing (wait longer)
- Check backend logs for errors
- Verify file size (large files take longer)
