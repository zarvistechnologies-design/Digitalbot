"""
Intelligent Skill Extraction System
Uses:
1. Predefined skill dictionary
2. KeyBERT for automatic keyword extraction
3. Skill normalization and synonyms
4. Context-aware matching
"""

import re
from typing import List, Set, Dict, Tuple
from rapidfuzz import fuzz
import logging

logger = logging.getLogger(__name__)

# KeyBERT is optional
try:
    from keybert import KeyBERT
    KEYBERT_AVAILABLE = True
except ImportError:
    KEYBERT_AVAILABLE = False
    logger.warning("KeyBERT not available. Install with: pip install keybert")


class SkillExtractor:
    """
    Extract and normalize technical skills from text
    """
    
    def __init__(self):
        # Initialize KeyBERT for automatic keyword extraction
        if KEYBERT_AVAILABLE:
            try:
                self.keybert = KeyBERT()
            except Exception as e:
                logger.warning(f"KeyBERT initialization failed: {e}")
                self.keybert = None
        else:
            self.keybert = None
        
        # Comprehensive skill database
        self.skill_database = self._build_skill_database()
        
        # Skill synonyms and variations
        self.skill_synonyms = self._build_synonyms()
        
        # Skill normalization map
        self.normalization_map = self._build_normalization_map()
    
    def _build_skill_database(self) -> Dict[str, List[str]]:
        """
        Build comprehensive skill database organized by category
        """
        return {
            # Programming Languages
            'languages': [
                'Python', 'Java', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'Rust',
                'PHP', 'Ruby', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'Perl',
                'Objective-C', 'Dart', 'Elixir', 'Haskell', 'Julia', 'Lua'
            ],
            
            # Web Frameworks
            'web_frameworks': [
                'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'Express.js',
                'React', 'Angular', 'Vue.js', 'Next.js', 'Nuxt.js', 'Svelte',
                'ASP.NET', 'Ruby on Rails', 'Laravel', 'Symfony', 'Node.js',
                'Nest.js', 'Koa', 'Sails.js', 'Meteor'
            ],
            
            # Databases
            'databases': [
                'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server',
                'Cassandra', 'DynamoDB', 'MariaDB', 'SQLite', 'CouchDB', 'Neo4j',
                'Elasticsearch', 'InfluxDB', 'TimescaleDB', 'Firebase', 'Firestore',
                'Realm', 'SQL'
            ],
            
            # Cloud & DevOps
            'cloud_devops': [
                'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s',
                'Terraform', 'Ansible', 'Jenkins', 'GitLab CI', 'GitHub Actions',
                'CircleCI', 'Travis CI', 'ArgoCD', 'Helm', 'Istio', 'Prometheus',
                'Grafana', 'ELK Stack', 'Datadog', 'New Relic', 'Splunk'
            ],
            
            # Data Science & ML
            'data_ml': [
                'TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'Pandas', 'NumPy',
                'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter', 'Apache Spark',
                'Hadoop', 'MLflow', 'Airflow', 'Kubeflow', 'XGBoost', 'LightGBM',
                'Hugging Face', 'Transformers', 'OpenCV', 'NLTK', 'spaCy',
                'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision',
                'Data Science', 'Data Engineering', 'MLOps'
            ],
            
            # Mobile Development
            'mobile': [
                'React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose',
                'Xamarin', 'Ionic', 'Cordova', 'Android SDK', 'iOS SDK'
            ],
            
            # Testing
            'testing': [
                'Pytest', 'unittest', 'Jest', 'JUnit', 'TestNG', 'Selenium',
                'Cypress', 'Playwright', 'Mocha', 'Chai', 'Jasmine', 'Karma',
                'Robot Framework', 'Cucumber', 'Postman', 'JMeter', 'LoadRunner',
                'TDD', 'BDD', 'Integration Testing', 'E2E Testing', 'Unit Testing'
            ],
            
            # APIs & Architecture
            'api_architecture': [
                'REST API', 'GraphQL', 'gRPC', 'SOAP', 'WebSockets', 'Microservices',
                'Monolith', 'Event-Driven Architecture', 'CQRS', 'DDD',
                'Message Queue', 'RabbitMQ', 'Kafka', 'Redis Pub/Sub', 'SQS', 'SNS'
            ],
            
            # Version Control
            'version_control': [
                'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN', 'Mercurial'
            ],
            
            # Security
            'security': [
                'OAuth', 'JWT', 'SAML', 'SSL/TLS', 'Encryption', 'Penetration Testing',
                'Security Auditing', 'OWASP', 'WAF', 'IAM', 'SSO', 'MFA'
            ],
            
            # Methodologies
            'methodologies': [
                'Agile', 'Scrum', 'Kanban', 'Lean', 'DevOps', 'CI/CD', 'Waterfall',
                'SDLC', 'Pair Programming', 'Code Review'
            ],
            
            # Soft Skills
            'soft_skills': [
                'Leadership', 'Communication', 'Problem Solving', 'Teamwork',
                'Project Management', 'Time Management', 'Critical Thinking',
                'Collaboration', 'Mentoring'
            ]
        }
    
    def _build_synonyms(self) -> Dict[str, List[str]]:
        """
        Build skill synonyms and variations
        """
        return {
            'JavaScript': ['JS', 'ECMAScript', 'Node', 'Node.js', 'NodeJS'],
            'TypeScript': ['TS'],
            'Python': ['python3', 'py'],
            'PostgreSQL': ['Postgres', 'psql', 'pg'],
            'MongoDB': ['Mongo', 'NoSQL'],
            'Kubernetes': ['k8s', 'k9s'],
            'Machine Learning': ['ML', 'AI', 'Artificial Intelligence'],
            'Deep Learning': ['DL', 'Neural Networks'],
            'NLP': ['Natural Language Processing', 'Text Processing'],
            'Computer Vision': ['CV', 'Image Processing'],
            'CI/CD': ['Continuous Integration', 'Continuous Deployment', 'DevOps Pipeline'],
            'REST API': ['RESTful', 'REST', 'HTTP API', 'Web API'],
            'SQL': ['Structured Query Language', 'Database Query'],
            'AWS': ['Amazon Web Services', 'EC2', 'S3', 'Lambda'],
            'Azure': ['Microsoft Azure'],
            'GCP': ['Google Cloud Platform', 'Google Cloud'],
        }
    
    def _build_normalization_map(self) -> Dict[str, str]:
        """
        Build normalization map (variations -> canonical form)
        """
        norm_map = {}
        
        for canonical, variations in self.skill_synonyms.items():
            for var in variations:
                norm_map[var.lower()] = canonical
            norm_map[canonical.lower()] = canonical
        
        return norm_map
    
    def normalize_skill(self, skill: str) -> str:
        """
        Normalize skill to canonical form
        Examples:
        - 'js' -> 'JavaScript'
        - 'postgres' -> 'PostgreSQL'
        - 'k8s' -> 'Kubernetes'
        """
        skill_lower = skill.lower().strip()
        return self.normalization_map.get(skill_lower, skill)
    
    def extract_skills(self, text: str) -> Set[str]:
        """
        Extract skills from text using multiple strategies
        Alias for extract_skills_from_text for backward compatibility
        """
        return self.extract_skills_from_text(text)
    
    def extract_skills_from_text(self, text: str) -> Set[str]:
        """
        Extract skills from text using multiple strategies
        """
        if not text:
            return set()
        
        found_skills = set()
        text_lower = text.lower()
        
        # Strategy 1: Direct matching from skill database
        for category, skills in self.skill_database.items():
            for skill in skills:
                # Exact match (case-insensitive)
                if re.search(r'\b' + re.escape(skill.lower()) + r'\b', text_lower):
                    found_skills.add(self.normalize_skill(skill))
                    continue
                
                # Partial match with context
                if skill.lower() in text_lower:
                    # Verify it's a real skill mention, not part of another word
                    pattern = r'[\W_]' + re.escape(skill.lower()) + r'[\W_]'
                    if re.search(pattern, ' ' + text_lower + ' '):
                        found_skills.add(self.normalize_skill(skill))
        
        # Strategy 2: Check synonyms
        for canonical, variations in self.skill_synonyms.items():
            for var in variations:
                if re.search(r'\b' + re.escape(var.lower()) + r'\b', text_lower):
                    found_skills.add(canonical)
        
        # Strategy 3: Use KeyBERT for auto-detection (finds skills not in database)
        if self.keybert:
            try:
                keywords = self.keybert.extract_keywords(
                    text,
                    keyphrase_ngram_range=(1, 3),
                    stop_words='english',
                    top_n=50,
                    use_mmr=True,
                    diversity=0.7
                )
                
                # Filter keywords that look like technical skills
                for keyword, score in keywords:
                    if score > 0.3:  # Relevance threshold
                        # Check if it matches any skill pattern
                        keyword_normalized = self.normalize_skill(keyword)
                        if self._is_technical_term(keyword_normalized):
                            found_skills.add(keyword_normalized)
            except Exception as e:
                logger.warning(f"KeyBERT extraction failed: {e}")
        
        logger.info(f"Extracted {len(found_skills)} skills")
        return found_skills
    
    def _is_technical_term(self, term: str) -> bool:
        """
        Check if a term looks like a technical skill
        """
        term_lower = term.lower()
        
        # Technical indicators
        tech_patterns = [
            r'\b\w+\.(js|py|go|rb|php|ts)\b',  # File extensions
            r'\b\w+(API|SDK|DB|SQL|ML|AI|UI|UX)\b',  # Technical abbreviations
            r'\b(react|angular|vue|django|flask|spring)\b',  # Common frameworks
            r'\b\w+\+\+\b',  # C++, etc.
        ]
        
        for pattern in tech_patterns:
            if re.search(pattern, term_lower):
                return True
        
        return False
    
    def compute_skill_match_score(
        self,
        resume_skills: Set[str],
        required_skills: List[str]
    ) -> Tuple[float, List[str], List[str]]:
        """
        Compute skill match score with details
        
        Returns:
            - Match score (0-100)
            - Matched skills
            - Missing skills
        """
        if not required_skills:
            return 100.0, [], []
        
        # Normalize all skills
        if isinstance(resume_skills, list):
            resume_skills = set(resume_skills)
        
        resume_skills_normalized = {self.normalize_skill(str(s)) for s in resume_skills}
        required_skills_normalized = [self.normalize_skill(str(s)) for s in required_skills]
        
        matched_skills = []
        missing_skills = []
        
        # Skill importance weights
        skill_weights = {
            # Critical skills (1.5x weight)
            'Python': 1.5, 'Java': 1.5, 'JavaScript': 1.5, 'Django': 1.5, 'React': 1.5,
            'AWS': 1.5, 'Kubernetes': 1.5, 'Docker': 1.5,
            
            # High priority (1.3x weight)
            'PostgreSQL': 1.3, 'MongoDB': 1.3, 'Redis': 1.3, 'TensorFlow': 1.3,
            'PyTorch': 1.3, 'Machine Learning': 1.3, 'Deep Learning': 1.3,
            
            # Medium priority (1.2x weight)
            'REST API': 1.2, 'GraphQL': 1.2, 'Microservices': 1.2, 'CI/CD': 1.2,
            
            # Standard (1.0x weight)
            'default': 1.0
        }
        
        total_weight = 0.0
        matched_weight = 0.0
        
        for req_skill in required_skills_normalized:
            weight = skill_weights.get(req_skill, skill_weights['default'])
            total_weight += weight
            
            # Exact match
            if req_skill in resume_skills_normalized:
                matched_skills.append(req_skill)
                matched_weight += weight
                continue
            
            # Fuzzy match
            best_match_score = 0
            best_match_skill = None
            
            for resume_skill in resume_skills_normalized:
                similarity = fuzz.ratio(req_skill.lower(), str(resume_skill).lower()) / 100
                if similarity > best_match_score:
                    best_match_score = similarity
                    best_match_skill = resume_skill
            
            # Accept fuzzy matches above 85%
            if best_match_score >= 0.85:
                matched_skills.append(f"{req_skill} (~{best_match_skill})")
                matched_weight += weight * best_match_score
            else:
                missing_skills.append(req_skill)
        
        # Calculate score
        if total_weight == 0:
            score = 100.0
        else:
            score = (matched_weight / total_weight) * 100
        
        return round(score, 2), matched_skills, missing_skills
    
    def get_skill_categories(self, skills: Set[str]) -> Dict[str, List[str]]:
        """
        Categorize skills into groups
        """
        categorized = {category: [] for category in self.skill_database.keys()}
        uncategorized = []
        
        for skill in skills:
            skill_normalized = self.normalize_skill(skill)
            found_category = False
            
            for category, category_skills in self.skill_database.items():
                if skill_normalized in category_skills:
                    categorized[category].append(skill_normalized)
                    found_category = True
                    break
            
            if not found_category:
                uncategorized.append(skill_normalized)
        
        if uncategorized:
            categorized['other'] = uncategorized
        
        # Remove empty categories
        categorized = {k: v for k, v in categorized.items() if v}
        
        return categorized


# Singleton instance
_skill_extractor = None


def get_skill_extractor() -> SkillExtractor:
    """Get or create skill extractor singleton"""
    global _skill_extractor
    if _skill_extractor is None:
        _skill_extractor = SkillExtractor()
    return _skill_extractor
