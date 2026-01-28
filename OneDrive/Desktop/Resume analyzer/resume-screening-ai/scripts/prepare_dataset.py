"""
Dataset Preparation Script for Kaggle Resume Datasets
Automatically prepare Kaggle resume datasets for model fine-tuning
"""

import json
import pandas as pd
from pathlib import Path
import sys
import re
import logging
from typing import List, Dict

# Add project root to path
root_dir = Path(__file__).parent.parent
sys.path.insert(0, str(root_dir))

from backend.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)



def prepare_kaggle_resume_dataset(csv_path: str, output_file: str = None):
    """
    Prepare Kaggle Resume Dataset for fine-tuning
    
    Popular Kaggle Datasets:
    1. "Resume Dataset" - UpdatedResumeDataSet.csv
       Columns: Category, Resume
       
    2. "Resume Screening Dataset"
       Columns: ID, Resume_str, Resume_html, Category
    
    Args:
        csv_path: Path to Kaggle CSV file
        output_file: Output JSON file for training
    """
    logger.info(f"📂 Loading Kaggle dataset from: {csv_path}")
    
    # Read CSV with multiple encoding attempts
    encodings = ['utf-8', 'latin-1', 'iso-8859-1', 'cp1252', 'utf-16']
    df = None
    last_error = None
    
    for encoding in encodings:
        try:
            df = pd.read_csv(csv_path, encoding=encoding)
            logger.info(f"✅ Successfully loaded with {encoding} encoding")
            break
        except Exception as e:
            last_error = str(e)
            continue
    
    if df is None:
        error_msg = f"Could not read CSV file with any encoding.\nLast error: {last_error}\nFile: {csv_path}"
        print(f"\n❌ ERROR DETAILS:")
        print(f"   File path: {csv_path}")
        print(f"   File exists: {Path(csv_path).exists()}")
        print(f"   Last error: {last_error}")
        print(f"\n💡 Troubleshooting:")
        print(f"   1. Make sure the file is not open in Excel or another program")
        print(f"   2. Check if the file is actually a CSV (not renamed TXT or ZIP)")
        print(f"   3. Try copying the file to the project directory:")
        print(f"      copy \"{csv_path}\" UpdatedResumeDataSet.csv")
        raise ValueError(error_msg)
    
    logger.info(f"📊 Dataset shape: {df.shape}")
    logger.info(f"📋 Columns: {df.columns.tolist()}")
    
    # Detect column names (different datasets use different names)
    resume_col = None
    category_col = None
    
    for col in df.columns:
        col_lower = col.lower()
        if 'resume' in col_lower and not 'html' in col_lower:
            resume_col = col
        if 'category' in col_lower or 'job' in col_lower or 'role' in col_lower:
            category_col = col
    
    if resume_col is None or category_col is None:
        raise ValueError(f"Could not find resume and category columns. Available: {df.columns.tolist()}")
    
    logger.info(f"📝 Using columns - Resume: '{resume_col}', Category: '{category_col}'")
    
    # Clean and prepare data
    df = df[[resume_col, category_col]].copy()
    df.columns = ['Resume', 'Category']
    df = df.dropna()
    
    # Clean text
    df['Resume'] = df['Resume'].apply(clean_text)
    
    logger.info(f"📊 Found {len(df)} resumes in {df['Category'].nunique()} categories")
    logger.info(f"📂 Categories: {df['Category'].unique().tolist()}")
    
    # Generate job descriptions for each category
    job_descriptions = generate_job_descriptions(df['Category'].unique())
    
    # Create training data
    training_data = []
    
    logger.info("🔄 Creating training examples...")
    
    for category in df['Category'].unique():
        category_resumes = df[df['Category'] == category]['Resume'].tolist()
        job_desc = job_descriptions[category]
        
        # Positive examples (same category = good match)
        for resume in category_resumes[:100]:  # Limit per category
            training_data.append({
                "resume": resume,
                "job_description": job_desc,
                "score": 0.85,  # High match
                "category": category,
                "type": "positive"
            })
        
        # Negative examples (different category = poor match)
        other_categories = [c for c in df['Category'].unique() if c != category]
        for other_cat in other_categories[:3]:  # Sample 3 other categories
            other_resumes = df[df['Category'] == other_cat]['Resume'].tolist()
            for resume in other_resumes[:20]:  # 20 negative examples
                training_data.append({
                    "resume": resume,
                    "job_description": job_desc,
                    "score": 0.20,  # Low match
                    "category": f"{category} vs {other_cat}",
                    "type": "negative"
                })
    
    logger.info(f"✅ Created {len(training_data)} training examples")
    
    # Print statistics
    print_dataset_statistics(training_data)
    
    # Save to JSON
    if output_file is None:
        output_file = settings.TRAINING_DATA_DIR / "kaggle_prepared.json"
    
    output_path = Path(output_file)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(training_data, f, indent=2, ensure_ascii=False)
    
    logger.info(f"💾 Training data saved to: {output_file}")
    
    return str(output_file)


def clean_text(text: str) -> str:
    """Clean resume text"""
    if not isinstance(text, str):
        return ""
    
    # Remove URLs
    text = re.sub(r'http\S+|www\S+', '', text)
    
    # Remove emails (keep them but normalize)
    text = re.sub(r'\S+@\S+', '[EMAIL]', text)
    
    # Remove phone numbers
    text = re.sub(r'\+?\d[\d\s\-\(\)]{7,}\d', '[PHONE]', text)
    
    # Remove extra whitespace
    text = ' '.join(text.split())
    
    # Limit length (models have token limits)
    if len(text) > 5000:
        text = text[:5000]
    
    return text.strip()


def generate_job_descriptions(categories: List[str]) -> Dict[str, str]:
    """Generate realistic job descriptions for each category"""
    
    # Comprehensive job description templates
    templates = {
        "Data Science": """
            Senior Data Scientist position. Looking for candidate with strong Python programming skills.
            Must have experience with machine learning algorithms, statistical analysis, and data visualization.
            Required: Python, pandas, scikit-learn, TensorFlow/PyTorch, SQL, Jupyter notebooks.
            Experience with big data tools (Spark, Hadoop) is a plus.
            Strong mathematical and statistical background required. PhD or Master's degree preferred.
            5+ years of experience in data science or related field.
        """,
        
        "Java Developer": """
            Senior Java Developer needed for enterprise applications. Must have strong Java programming skills.
            Required: Java 8+, Spring Framework, Spring Boot, Hibernate, REST APIs, microservices architecture.
            Database experience: MySQL, PostgreSQL, MongoDB. Maven/Gradle build tools.
            Experience with cloud platforms (AWS, Azure) preferred. Docker and Kubernetes knowledge is a plus.
            Bachelor's degree in Computer Science. 5-7 years of Java development experience.
        """,
        
        "Python Developer": """
            Python Backend Developer position. Strong Python programming required.
            Frameworks: Django or Flask, FastAPI for REST APIs. Database: PostgreSQL, MongoDB.
            Experience with async programming, Celery, Redis. Testing: pytest, unittest.
            Version control: Git. Deployment: Docker, AWS/GCP. Agile methodology experience.
            Bachelor's degree in Computer Science or related field. 3-5 years Python experience.
        """,
        
        "Web Designing": """
            UI/UX Designer and Frontend Developer. Strong HTML5, CSS3, JavaScript skills required.
            Frontend frameworks: React.js, Angular, or Vue.js. Responsive design expertise.
            Experience with: Bootstrap, Tailwind CSS, SASS/LESS. Design tools: Figma, Adobe XD, Sketch.
            Understanding of UX principles, user research, wireframing. Git version control.
            Portfolio showcasing web design projects required. 2-4 years experience.
        """,
        
        "HR": """
            Human Resources Manager position. Strong interpersonal and communication skills required.
            Responsibilities: Recruitment, employee onboarding, performance management, training and development.
            Experience with HRIS systems, payroll processing, employee relations, compliance.
            Knowledge of labor laws and HR best practices. Strong organizational skills.
            Bachelor's degree in HR or Business Administration. HR certification (PHR/SPHR) preferred.
            5+ years of HR management experience.
        """,
        
        "Advocate": """
            Legal Counsel / Corporate Lawyer position. Law degree (LLB/JD) required.
            Areas: Corporate law, contracts, compliance, litigation, intellectual property.
            Strong legal research, writing, and negotiation skills. Experience with legal software.
            Knowledge of corporate governance, regulatory compliance, mergers and acquisitions.
            Bar admission required. Excellent analytical and problem-solving abilities.
            5-10 years of legal practice experience. Large firm or corporate experience preferred.
        """,
        
        "Mechanical Engineer": """
            Mechanical Engineer for product design and development. Strong CAD skills required.
            Software: AutoCAD, SolidWorks, CATIA, ANSYS. Experience with FEA, CFD analysis.
            Knowledge of manufacturing processes, materials science, thermodynamics, mechanics.
            Project management skills. Team collaboration and communication abilities.
            Bachelor's degree in Mechanical Engineering. PE license preferred.
            3-7 years of engineering experience in relevant industry.
        """,
        
        "Sales": """
            Sales Manager position. Strong sales and business development skills required.
            Responsibilities: Lead generation, client relationship management, sales strategy, team leadership.
            Experience with CRM software (Salesforce, HubSpot). Excellent negotiation and closing skills.
            Track record of meeting/exceeding sales targets. Strong presentation and communication skills.
            Bachelor's degree in Business or related field. Industry-specific knowledge preferred.
            5+ years of B2B sales experience with 2+ years in management.
        """,
        
        "Health and fitness": """
            Fitness Trainer / Health Coach position. Certified personal trainer required.
            Certifications: ACE, NASM, ISSA, or equivalent. Nutrition knowledge essential.
            Specialties: Strength training, cardio, flexibility, weight management, sports conditioning.
            Experience with fitness assessment, program design, client motivation.
            CPR/First Aid certified. Strong interpersonal and communication skills.
            2-5 years of training experience. Bachelor's degree in Exercise Science preferred.
        """,
        
        "Arts": """
            Graphic Designer / Creative Artist position. Strong portfolio required.
            Software: Adobe Creative Suite (Photoshop, Illustrator, InDesign), Figma, Sketch.
            Skills: Branding, logo design, print design, digital illustration, typography.
            Understanding of design principles, color theory, composition. Client communication skills.
            Experience with motion graphics (After Effects) is a plus. Social media graphics experience.
            Bachelor's degree in Graphic Design or Fine Arts. 2-4 years professional experience.
        """,
        
        "Database": """
            Database Administrator / Developer position. Strong SQL skills required.
            Databases: PostgreSQL, MySQL, Oracle, SQL Server, MongoDB. Database design and modeling.
            Performance tuning, query optimization, indexing strategies. Backup and recovery.
            Experience with cloud databases (AWS RDS, Azure SQL). ETL processes, data warehousing.
            Python or other scripting for automation. Security and compliance knowledge.
            Bachelor's degree in Computer Science. 4-6 years DBA experience. Certification preferred.
        """,
        
        "Electrical Engineering": """
            Electrical Engineer for power systems and electronics design. Strong circuit design skills.
            Software: MATLAB, Simulink, SPICE, AutoCAD Electrical, Altium Designer.
            Knowledge: Power electronics, control systems, embedded systems, PCB design, signal processing.
            Experience with testing equipment, troubleshooting, regulatory compliance (FCC, CE, UL).
            Bachelor's degree in Electrical Engineering. PE license is a plus.
            3-6 years of electrical engineering experience.
        """,
        
        "Operations Manager": """
            Operations Manager for process optimization and team leadership. Strong analytical skills.
            Responsibilities: Process improvement, supply chain management, quality control, budgeting.
            Experience with Lean Six Sigma methodologies. Project management skills (PMP preferred).
            Strong leadership, communication, and problem-solving abilities. ERP systems knowledge.
            Bachelor's degree in Business, Engineering, or Operations Management. MBA is a plus.
            7-10 years operations experience with 3+ years in management.
        """,
        
        "DevOps Engineer": """
            DevOps Engineer for CI/CD and infrastructure automation. Strong Linux administration skills.
            Required: Docker, Kubernetes, Jenkins, GitLab CI/CD, Terraform, Ansible, CloudFormation.
            Cloud platforms: AWS (EC2, S3, Lambda, RDS) or Azure or GCP. Scripting: Python, Bash.
            Monitoring: Prometheus, Grafana, ELK stack. Security best practices, networking knowledge.
            Bachelor's degree in Computer Science. DevOps certification preferred.
            4-6 years experience in DevOps or related role.
        """,
        
        "Automation Testing": """
            Automation Test Engineer / SDET position. Strong programming skills required.
            Automation frameworks: Selenium WebDriver, Cypress, Playwright, Appium (mobile).
            Programming: Java, Python, or JavaScript. API testing: Postman, REST Assured.
            CI/CD integration: Jenkins, GitHub Actions. Performance testing: JMeter, Gatling.
            Test strategy, test planning, defect tracking (JIRA). Agile/Scrum experience.
            Bachelor's degree in Computer Science. 3-5 years automation testing experience.
        """,
        
        "Business Analyst": """
            Business Analyst for requirements gathering and process analysis. Strong analytical skills.
            Responsibilities: Stakeholder management, requirements documentation, process mapping, UAT.
            Tools: JIRA, Confluence, MS Visio, SQL, Excel. Experience with Agile methodologies.
            Skills: Data analysis, reporting, gap analysis, business case development.
            Strong communication, presentation, and documentation abilities. Domain knowledge valued.
            Bachelor's degree in Business, IT, or related field. CBAP certification is a plus.
            4-6 years BA experience.
        """,
        
        "Civil Engineer": """
            Civil Engineer for construction and infrastructure projects. Strong structural analysis skills.
            Software: AutoCAD Civil 3D, Revit, SAP2000, STAAD.Pro, Primavera P6.
            Knowledge: Structural design, geotechnical engineering, construction management, surveying.
            Experience with building codes, project estimation, contract management. Site supervision.
            Bachelor's degree in Civil Engineering. PE license required or in progress.
            3-7 years experience in civil/structural engineering.
        """,
        
        "ETL Developer": """
            ETL Developer for data integration and warehousing. Strong SQL and data modeling skills.
            ETL tools: Informatica, Talend, SSIS, Apache NiFi, AWS Glue. Database: Oracle, SQL Server.
            Data warehousing: Snowflake, Redshift, BigQuery. Python/Shell scripting.
            Understanding of data quality, dimensional modeling, star schema. Version control: Git.
            Bachelor's degree in Computer Science or related field.
            4-6 years ETL development experience.
        """,
        
        "Blockchain": """
            Blockchain Developer for decentralized applications. Strong smart contract development.
            Platforms: Ethereum, Hyperledger, Binance Smart Chain, Polygon. Solidity programming.
            Tools: Truffle, Hardhat, Ganache, Web3.js, ethers.js. Understanding of DeFi, NFTs, DAOs.
            Cryptography knowledge, consensus mechanisms, blockchain architecture.
            Bachelor's degree in Computer Science. Blockchain certification preferred.
            2-4 years blockchain development experience.
        """,
        
        "Testing": """
            QA Engineer / Software Tester position. Strong testing fundamentals required.
            Testing types: Functional, regression, integration, system, UAT. Test case design.
            Manual and automation testing. Bug tracking: JIRA, Bugzilla. API testing knowledge.
            Understanding of SDLC, Agile/Scrum. Basic SQL skills. Attention to detail.
            Good communication for defect reporting and documentation.
            Bachelor's degree in Computer Science or related. ISTQB certification is a plus.
            2-4 years testing experience.
        """,
        
        "SAP Developer": """
            SAP Developer / Consultant for ERP implementation. Strong ABAP programming required.
            Modules: SAP FI/CO, MM, SD, PP, HR, or S/4HANA. ABAP Objects, SAP HANA, Fiori/UI5.
            Experience with SAP integration, custom developments, reports, interfaces, enhancements.
            Understanding of business processes. SAP certification preferred.
            Bachelor's degree in Computer Science or related field.
            4-7 years SAP development/consulting experience.
        """,
        
        "Network Security Engineer": """
            Network Security Engineer for infrastructure protection. Strong security fundamentals.
            Skills: Firewall configuration (Cisco ASA, Palo Alto), VPN, IDS/IPS, SIEM tools.
            Knowledge: Network protocols, security frameworks (NIST, ISO 27001), penetration testing.
            Certifications valued: CISSP, CEH, CompTIA Security+, CCNP Security.
            Experience with security audits, incident response, vulnerability assessment.
            Bachelor's degree in Cybersecurity or Computer Science. 4-6 years security experience.
        """,
        
        "DotNet Developer": """
            .NET Developer for enterprise applications. Strong C# programming required.
            Frameworks: .NET Core, ASP.NET MVC, Web API, Entity Framework. Frontend: Angular, React.
            Database: SQL Server, Azure SQL. Cloud: Azure services (App Service, Functions, Storage).
            Design patterns, SOLID principles, microservices architecture. Unit testing: xUnit, NUnit.
            Version control: Git, Azure DevOps. Agile development experience.
            Bachelor's degree in Computer Science. 4-6 years .NET development experience.
        """,
    }
    
    # Create job descriptions dict
    job_descriptions = {}
    
    for category in categories:
        category_clean = category.strip()
        
        if category_clean in templates:
            job_descriptions[category_clean] = templates[category_clean].strip()
        else:
            # Generic template for unknown categories
            job_descriptions[category_clean] = f"""
                {category_clean} position available. Looking for experienced professional in {category_clean}.
                Strong technical skills and relevant experience required. Excellent problem-solving abilities.
                Good communication and teamwork skills essential. Bachelor's degree or equivalent experience.
                3-5 years of relevant professional experience in {category_clean}.
            """.strip()
    
    return job_descriptions


def print_dataset_statistics(training_data: List[Dict]):
    """Print detailed dataset statistics"""
    
    positive = sum(1 for d in training_data if d.get('score', 0) >= 0.7)
    negative = sum(1 for d in training_data if d.get('score', 0) < 0.4)
    neutral = len(training_data) - positive - negative
    
    categories = {}
    for d in training_data:
        cat = d.get('category', 'Unknown')
        categories[cat] = categories.get(cat, 0) + 1
    
    print("\n" + "=" * 70)
    print("📊 DATASET STATISTICS")
    print("=" * 70)
    print(f"\n📈 Total Examples: {len(training_data)}")
    print(f"   ✅ Positive matches (score >= 0.7): {positive} ({positive/len(training_data)*100:.1f}%)")
    print(f"   ⚖️  Neutral matches (0.4-0.7): {neutral} ({neutral/len(training_data)*100:.1f}%)")
    print(f"   ❌ Negative matches (score < 0.4): {negative} ({negative/len(training_data)*100:.1f}%)")
    
    print(f"\n📂 Unique Categories: {len(categories)}")
    print("\n   Examples per category:")
    for cat, count in sorted(categories.items(), key=lambda x: x[1], reverse=True)[:10]:
        print(f"   - {cat}: {count}")
    
    print("\n" + "=" * 70)


def create_training_dataset():
    """Legacy function - kept for compatibility"""
    logger.info("Use prepare_kaggle_resume_dataset() instead")
    return None


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Prepare Kaggle Resume Dataset for Fine-tuning"
    )
    parser.add_argument(
        '--kaggle-csv',
        type=str,
        required=True,
        help='Path to Kaggle resume CSV file (e.g., UpdatedResumeDataSet.csv)'
    )
    parser.add_argument(
        '--output',
        type=str,
        help='Output JSON file path (optional)'
    )
    
    args = parser.parse_args()
    
    print("\n" + "=" * 70)
    print("🚀 KAGGLE RESUME DATASET PREPARATION")
    print("=" * 70)
    
    try:
        output_file = prepare_kaggle_resume_dataset(args.kaggle_csv, args.output)
        
        print("\n✅ SUCCESS! Dataset prepared for training")
        print("\n" + "=" * 70)
        print("📝 NEXT STEPS:")
        print("=" * 70)
        print("\n1️⃣  Review the prepared data:")
        print(f"   Open: {output_file}")
        print("\n2️⃣  Train the model:")
        print(f"   python scripts/train_custom_model.py --train {output_file} --epochs 4")
        print("\n3️⃣  Use the fine-tuned model:")
        print("   Update backend/api/routes.py to use the enhanced ML engine")
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\n💡 Make sure your CSV has 'Resume' and 'Category' columns")
        print("   Popular Kaggle datasets: Search for 'resume dataset' on Kaggle")

