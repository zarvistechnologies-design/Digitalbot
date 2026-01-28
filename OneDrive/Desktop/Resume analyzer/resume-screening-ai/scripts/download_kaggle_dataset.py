"""
Download Kaggle Resume Dataset
Helper script to download the dataset
"""

import os
from pathlib import Path

print("=" * 70)
print("📥 KAGGLE DATASET DOWNLOAD INSTRUCTIONS")
print("=" * 70)

print("\n⚠️  Kaggle API requires authentication")
print("\n📝 Step-by-step setup:")
print("\n1️⃣  Go to: https://www.kaggle.com/")
print("   - Sign in or create free account")

print("\n2️⃣  Go to your account settings:")
print("   - Click your profile picture (top right)")
print("   - Select 'Settings'")

print("\n3️⃣  Create API token:")
print("   - Scroll to 'API' section")
print("   - Click 'Create New Token'")
print("   - This downloads 'kaggle.json'")

print("\n4️⃣  Place kaggle.json in the correct location:")
kaggle_dir = Path.home() / ".kaggle"
print(f"   Windows: {kaggle_dir}")
print("   ")
print("   - Create folder if it doesn't exist")
print("   - Move kaggle.json into this folder")
print(f"   - Full path should be: {kaggle_dir / 'kaggle.json'}")

print("\n5️⃣  Run this command to download:")
print("   kaggle datasets download -d gauravduttakiit/resume-dataset")

print("\n6️⃣  Unzip the downloaded file:")
print("   unzip resume-dataset.zip")

print("\n" + "=" * 70)
print("🔍 Alternative: Manual Download (Easier!)")
print("=" * 70)
print("\n1. Go to: https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset")
print("2. Click the 'Download' button")
print("3. Extract the ZIP file")
print("4. Move UpdatedResumeDataSet.csv to:")
print(f"   {Path.cwd()}")
print("\n5. Run the prepare script:")
print("   python scripts/prepare_dataset.py --kaggle-csv UpdatedResumeDataSet.csv")

print("\n" + "=" * 70)

# Check if kaggle.json exists
kaggle_config = kaggle_dir / "kaggle.json"
if kaggle_config.exists():
    print("\n✅ Kaggle credentials found!")
    print("\nAttempting to download dataset...")
    
    os.system("kaggle datasets download -d gauravduttakiit/resume-dataset -p .")
    
    print("\nUnzipping...")
    os.system("tar -xf resume-dataset.zip")  # Windows 10+ has tar built-in
    
    if Path("UpdatedResumeDataSet.csv").exists():
        print("\n✅ SUCCESS! Dataset downloaded!")
        print("\nNext step:")
        print("python scripts/prepare_dataset.py --kaggle-csv UpdatedResumeDataSet.csv")
    else:
        print("\n⚠️  Please extract the zip file manually")
else:
    print("\n❌ Kaggle credentials not found")
    print(f"   Create {kaggle_config} first (see instructions above)")
    print("\n💡 OR download manually from Kaggle website (easier!)")
