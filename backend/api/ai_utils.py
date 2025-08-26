"""
AI utility functions
"""
import openai
from django.conf import settings


# Candidate summary for AI context
CANDIDATE_SUMMARY = """
Candidate: Iradukunda Shami Honore — Python/Django backend developer and AI enthusiast. 
Experienced with e-commerce APIs, real-time chat apps, FastAPI, and online grocery store development. 
Projects include a Blog App with user features, a Mini E-commerce App with analytics, 
a Grocery Store with orders/chat, and an Accountability App prototype. 
Skilled in Python, Django, FastAPI, Tailwind CSS, and AI integrations.
"""


def get_openai_client():
    """Get OpenAI client if API key is available"""
    if settings.OPENAI_API_KEY:
        return openai.OpenAI(api_key=settings.OPENAI_API_KEY)
    return None


def generate_interview_questions(job_description, audio_answer=None):
    """Generate mock interview questions and feedback"""
    client = get_openai_client()
    
    if not client:
        # Fallback mock data when no API key
        return {
            'questions': [
                "Tell me about your experience with Python and Django development.",
                "How do you approach building scalable web applications?",
                "Describe a challenging project you've worked on recently.",
                "How do you stay updated with new technologies?",
                "What interests you about this role?"
            ],
            'model_answers': [
                "I have extensive experience with Python and Django, having built several full-stack applications including e-commerce platforms and real-time chat systems.",
                "I focus on clean architecture, proper database design, and implementing caching strategies for performance optimization.",
                "I recently built a grocery store application with real-time chat and order management, which required careful planning of the database schema and API design.",
                "I regularly follow tech blogs, contribute to open-source projects, and experiment with new frameworks like FastAPI.",
                "I'm excited about the opportunity to work on challenging problems and contribute to innovative solutions in this role."
            ],
            'transcript': None,
            'feedback': "Practice speaking clearly and provide specific examples from your projects."
        }
    
    try:
        # Generate questions based on job description
        questions_prompt = f"""
        Based on this job description and candidate profile, generate 5 relevant interview questions:
        
        Job Description: {job_description}
        
        Candidate Profile: {CANDIDATE_SUMMARY}
        
        Generate questions that are specific to the role and the candidate's background.
        Return as a JSON array of strings.
        """
        
        questions_response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": questions_prompt}],
            temperature=0.7
        )
        
        # Generate model answers
        answers_prompt = f"""
        For these interview questions and candidate profile, provide strong sample answers:
        
        Questions: {questions_response.choices[0].message.content}
        Candidate Profile: {CANDIDATE_SUMMARY}
        
        Provide answers that highlight the candidate's experience and skills.
        Return as a JSON array of strings.
        """
        
        answers_response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": answers_prompt}],
            temperature=0.7
        )
        
        result = {
            'questions': eval(questions_response.choices[0].message.content),
            'model_answers': eval(answers_response.choices[0].message.content),
            'transcript': None,
            'feedback': "Review the model answers and practice articulating your experience clearly."
        }
        
        # TODO: Add audio transcription and feedback if audio_answer is provided
        
        return result
        
    except Exception as e:
        # Fallback to mock data on error
        return generate_interview_questions(job_description)


def generate_tour_script(section):
    """Generate tour script for portfolio section"""
    client = get_openai_client()
    
    # Section-specific content
    section_content = {
        'home': "Welcome to Shami's portfolio! I'm a Python/Django developer passionate about building scalable web applications.",
        'projects': "Here are some of my key projects including e-commerce platforms, chat applications, and AI integrations.",
        'blog': "Check out my technical blog posts where I share insights about web development and AI.",
        'contact': "Feel free to reach out if you'd like to discuss opportunities or collaborate on projects."
    }
    
    if not client:
        # Fallback script
        return {
            'script': section_content.get(section, "Welcome to this section of my portfolio!"),
            'audio_url': None
        }
    
    try:
        prompt = f"""
        Create an engaging, conversational tour script for the {section} section of a portfolio website.
        
        Candidate Profile: {CANDIDATE_SUMMARY}
        
        The script should be:
        - Conversational and friendly
        - About 2-3 sentences
        - Highlight relevant skills and experience
        - Encourage engagement
        
        Section context: {section_content.get(section, '')}
        """
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8
        )
        
        script = response.choices[0].message.content.strip()
        
        # TODO: Add text-to-speech integration with ElevenLabs
        
        return {
            'script': script,
            'audio_url': None  # Will be implemented with TTS integration
        }
        
    except Exception as e:
        return {
            'script': section_content.get(section, "Welcome to this section of my portfolio!"),
            'audio_url': None
        }
