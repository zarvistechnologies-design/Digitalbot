"""
Feedback Generator
Provides detailed feedback on resume quality and suggestions for improvement
"""

from typing import Dict, List, Set
import logging

logger = logging.getLogger(__name__)


class FeedbackGenerator:
    """
    Generate actionable feedback for candidates
    """
    
    @staticmethod
    def generate_comprehensive_feedback(
        resume_data: Dict,
        job_data: Dict,
        scores: Dict
    ) -> Dict:
        """
        Generate comprehensive feedback report
        
        Args:
            resume_data: Parsed resume data (skills, experience, education)
            job_data: Job description data (required skills, experience)
            scores: Individual component scores
            
        Returns:
            Detailed feedback dictionary
        """
        feedback = {
            'overall_assessment': FeedbackGenerator._assess_overall_fit(scores['final_score']),
            'skill_gaps': FeedbackGenerator._analyze_skill_gaps(
                resume_data.get('skills', set()),
                job_data.get('required_skills', [])
            ),
            'experience_feedback': FeedbackGenerator._analyze_experience(
                resume_data.get('years_of_experience', 0),
                job_data.get('required_experience', 3),
                scores.get('experience_score', 0)
            ),
            'education_feedback': FeedbackGenerator._analyze_education(
                resume_data.get('education', []),
                scores.get('education_score', 0)
            ),
            'strengths': FeedbackGenerator._identify_strengths(resume_data, scores),
            'improvement_suggestions': FeedbackGenerator._generate_improvement_tips(
                resume_data, job_data, scores
            ),
            'resume_optimization_tips': FeedbackGenerator._generate_resume_tips(resume_data),
            'match_percentage': scores['final_score']
        }
        
        return feedback
    
    @staticmethod
    def _assess_overall_fit(final_score: float) -> str:
        """
        Provide overall assessment based on score
        """
        if final_score >= 80:
            return "🌟 Excellent Match! You are a strong candidate for this role. Your skills and experience align very well with the requirements."
        elif final_score >= 60:
            return "✅ Good Match. You meet most requirements, but there are some areas for improvement to become a top candidate."
        elif final_score >= 40:
            return "⚠️ Moderate Match. You have some relevant skills, but significant gaps exist. Consider upskilling in key areas."
        elif final_score >= 20:
            return "❌ Weak Match. Your profile doesn't align well with this role. Major skill and experience gaps need to be addressed."
        else:
            return "🚫 Poor Match. This role may not be suitable for your current skill set. Consider roles that better match your expertise."
    
    @staticmethod
    def _analyze_skill_gaps(
        resume_skills: Set[str],
        required_skills: List[str]
    ) -> Dict:
        """
        Analyze missing and matched skills
        """
        if isinstance(resume_skills, list):
            resume_skills = set(resume_skills)
        
        resume_skills_lower = {str(s).lower() for s in resume_skills}
        required_skills_lower = {str(s).lower() for s in required_skills}
        
        matched = resume_skills_lower & required_skills_lower
        missing = required_skills_lower - resume_skills_lower
        
        # Categorize missing skills by priority
        critical_missing = []
        important_missing = []
        nice_to_have_missing = []
        
        critical_skills = {'python', 'java', 'javascript', 'react', 'django', 'aws', 'docker', 'kubernetes'}
        important_skills = {'postgresql', 'mongodb', 'redis', 'git', 'ci/cd', 'rest api', 'graphql'}
        
        for skill in missing:
            if skill in critical_skills:
                critical_missing.append(skill)
            elif skill in important_skills:
                important_missing.append(skill)
            else:
                nice_to_have_missing.append(skill)
        
        return {
            'matched_skills': sorted(list(matched)),
            'total_missing': len(missing),
            'critical_missing': sorted(critical_missing),
            'important_missing': sorted(important_missing),
            'nice_to_have_missing': sorted(nice_to_have_missing),
            'match_rate': round(len(matched) / len(required_skills_lower) * 100, 1) if required_skills_lower else 100.0
        }
    
    @staticmethod
    def _analyze_experience(
        resume_years: float,
        required_years: float,
        experience_score: float
    ) -> Dict:
        """
        Analyze experience gap
        """
        gap = required_years - resume_years
        
        if gap <= 0:
            status = "✅ Meets requirement"
            message = f"You have {resume_years} years of experience, which exceeds the {required_years} years requirement."
        elif gap <= 1:
            status = "⚠️ Slightly below"
            message = f"You have {resume_years} years of experience. Aim for {required_years} years to fully meet requirements."
        else:
            status = "❌ Significantly below"
            message = f"You have {resume_years} years of experience, but {required_years} years are required. Consider gaining {gap:.1f} more years of relevant experience."
        
        return {
            'status': status,
            'message': message,
            'resume_years': resume_years,
            'required_years': required_years,
            'gap_years': max(0, gap),
            'score': experience_score
        }
    
    @staticmethod
    def _analyze_education(
        education_list: List[Dict],
        education_score: float
    ) -> Dict:
        """
        Analyze education qualifications
        """
        if not education_list:
            return {
                'status': '❌ No education info found',
                'message': 'Add your educational qualifications to your resume.',
                'highest_degree': None,
                'score': education_score
            }
        
        # Find highest degree
        degree_hierarchy = {'PhD': 4, 'Master': 3, 'Bachelor': 2, 'Diploma': 1}
        highest = max(education_list, key=lambda x: degree_hierarchy.get(x.get('degree', ''), 0))
        
        degree = highest.get('degree', 'Unknown')
        spec = highest.get('specialization', 'Unknown')
        
        if degree == 'PhD':
            status = '🌟 Excellent'
            message = f"PhD in {spec} is a strong qualification."
        elif degree == 'Master':
            status = '✅ Good'
            message = f"Master's degree in {spec} meets most requirements."
        elif degree == 'Bachelor':
            status = '⚠️ Basic requirement'
            message = f"Bachelor's degree in {spec}. Consider pursuing higher education for competitive advantage."
        else:
            status = '❌ Below expectations'
            message = f"{degree} may not meet requirements for senior roles. Consider pursuing a degree."
        
        return {
            'status': status,
            'message': message,
            'highest_degree': f"{degree} in {spec}",
            'score': education_score
        }
    
    @staticmethod
    def _identify_strengths(resume_data: Dict, scores: Dict) -> List[str]:
        """
        Identify candidate's strengths
        """
        strengths = []
        
        # High semantic match
        if scores.get('semantic_score', 0) >= 70:
            strengths.append("📝 Strong resume-job alignment: Your experience description closely matches the role requirements.")
        
        # Strong skills
        if scores.get('skill_match_score', 0) >= 70:
            strengths.append("💪 Excellent skill match: You possess most of the required technical skills.")
        
        # Good experience
        if scores.get('experience_score', 0) >= 80:
            strengths.append("⏱️ Solid experience: Your years of experience exceed the role requirements.")
        
        # Good education
        if scores.get('education_score', 0) >= 90:
            strengths.append("🎓 Strong educational background: Your degree is highly relevant.")
        
        # Diverse skills
        skills = resume_data.get('skills', set())
        if len(skills) >= 15:
            strengths.append(f"🛠️ Diverse skill set: You have {len(skills)} technical skills, showing versatility.")
        
        if not strengths:
            strengths.append("Keep building your skills and experience!")
        
        return strengths
    
    @staticmethod
    def _generate_improvement_tips(
        resume_data: Dict,
        job_data: Dict,
        scores: Dict
    ) -> List[str]:
        """
        Generate actionable improvement suggestions
        """
        tips = []
        
        # Skill gap tips
        if scores.get('skill_match_score', 0) < 60:
            missing_skills = set(job_data.get('required_skills', [])) - set(resume_data.get('skills', set()))
            if missing_skills:
                top_missing = list(missing_skills)[:3]
                tips.append(f"🎯 Priority Skills: Learn {', '.join(top_missing)} to improve your candidacy.")
        
        # Experience tips
        if scores.get('experience_score', 0) < 60:
            gap = job_data.get('required_experience', 3) - resume_data.get('years_of_experience', 0)
            if gap > 0:
                tips.append(f"📈 Gain {gap:.1f} more years of relevant experience, or highlight transferable skills.")
        
        # Semantic match tips
        if scores.get('semantic_score', 0) < 50:
            tips.append("✍️ Tailor your resume: Use keywords from the job description to improve ATS compatibility.")
            tips.append("📋 Quantify achievements: Add metrics and numbers to demonstrate impact (e.g., 'Improved performance by 40%').")
        
        # Education tips
        if scores.get('education_score', 0) < 75:
            tips.append("🎓 Consider pursuing relevant certifications or higher education to strengthen your profile.")
        
        # General tips
        tips.append("🔄 Update your resume: Keep it current with your latest projects and skills.")
        tips.append("🌐 Build portfolio: Create GitHub projects or personal website showcasing your work.")
        
        return tips[:5]  # Return top 5 tips
    
    @staticmethod
    def _generate_resume_tips(resume_data: Dict) -> List[str]:
        """
        Generate resume formatting and content tips
        """
        tips = []
        
        # Check if resume has key sections
        skills = resume_data.get('skills', set())
        experience = resume_data.get('years_of_experience', 0)
        education = resume_data.get('education', [])
        
        if len(skills) < 10:
            tips.append("📝 Add more technical skills to your resume (aim for 15-20 relevant skills).")
        
        if experience == 0:
            tips.append("💼 Clearly mention your years of experience in the resume.")
        
        if not education:
            tips.append("🎓 Add your education section with degree, specialization, and graduation year.")
        
        # General formatting tips
        tips.append("✨ Use action verbs: Start bullet points with words like 'Developed', 'Designed', 'Led', 'Optimized'.")
        tips.append("📊 Add metrics: Include numbers, percentages, and outcomes to quantify your impact.")
        tips.append("🎯 Customize for each job: Tailor your resume to match specific job requirements.")
        tips.append("🔍 Use keywords: Include technology names, tools, and frameworks mentioned in job descriptions.")
        tips.append("📄 Keep it concise: Limit to 1-2 pages, focusing on most relevant experience.")
        
        return tips[:5]
    
    @staticmethod
    def generate_summary_report(feedback: Dict) -> str:
        """
        Generate a text summary of feedback
        """
        lines = []
        lines.append("=" * 60)
        lines.append("RESUME ANALYSIS REPORT")
        lines.append("=" * 60)
        lines.append(f"\nMatch Score: {feedback['match_percentage']:.1f}%")
        lines.append(f"Assessment: {feedback['overall_assessment']}\n")
        
        # Skill gaps
        skill_gaps = feedback['skill_gaps']
        lines.append(f"Skill Match Rate: {skill_gaps['match_rate']:.1f}%")
        lines.append(f"Matched Skills ({len(skill_gaps['matched_skills'])}): {', '.join(skill_gaps['matched_skills'][:10])}")
        
        if skill_gaps['critical_missing']:
            lines.append(f"❗ Critical Missing Skills: {', '.join(skill_gaps['critical_missing'])}")
        
        # Experience
        exp = feedback['experience_feedback']
        lines.append(f"\n{exp['status']}: {exp['message']}")
        
        # Education
        edu = feedback['education_feedback']
        lines.append(f"\n{edu['status']}: {edu['message']}")
        
        # Strengths
        lines.append("\n✨ Your Strengths:")
        for strength in feedback['strengths']:
            lines.append(f"  - {strength}")
        
        # Improvements
        lines.append("\n🚀 How to Improve:")
        for i, tip in enumerate(feedback['improvement_suggestions'], 1):
            lines.append(f"  {i}. {tip}")
        
        lines.append("=" * 60)
        
        return "\n".join(lines)
