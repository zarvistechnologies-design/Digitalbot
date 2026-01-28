"""
Test PDF text extraction
"""
import PyPDF2
import sys

def test_pdf(pdf_path):
    """Test if PDF has extractable text"""
    try:
        with open(pdf_path, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            print(f"PDF: {pdf_path}")
            print(f"Number of pages: {len(pdf_reader.pages)}")
            print("-" * 50)
            
            total_text = ""
            for i, page in enumerate(pdf_reader.pages):
                text = page.extract_text()
                total_text += text
                print(f"Page {i+1} text length: {len(text)} characters")
                if text:
                    print(f"First 100 chars: {text[:100]}")
                print()
            
            print("-" * 50)
            print(f"Total extracted text: {len(total_text)} characters")
            
            if len(total_text) < 10:
                print("\n❌ PDF appears to be IMAGE-BASED (scanned)")
                print("Solution: Convert to text-based PDF or use OCR")
            else:
                print("\n✅ PDF has extractable text!")
                
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")

if __name__ == "__main__":
    # Test with the problematic file
    test_path = r"C:\Users\sumit\OneDrive\Desktop\Resume analyzer\resume-screening-ai\temp\uploads"
    
    print("Testing PDF files in uploads folder...")
    print("=" * 50)
    
    from pathlib import Path
    upload_dir = Path(test_path)
    
    if upload_dir.exists():
        pdf_files = list(upload_dir.glob("*.pdf"))
        if pdf_files:
            for pdf in pdf_files:
                test_pdf(str(pdf))
                print("\n" + "=" * 50 + "\n")
        else:
            print("No PDF files found in uploads folder")
    else:
        print(f"Upload directory doesn't exist: {test_path}")
