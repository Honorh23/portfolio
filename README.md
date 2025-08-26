# Shami Portfolio AI

A comprehensive personal portfolio website with AI-powered features including an Interview Prep Agent and Portfolio Tour Guide. Built with Django REST Framework backend and Next.js frontend.

## 🚀 Features

### Core Portfolio
- **Responsive Design**: Modern, professional design with dark/light mode
- **Project Showcase**: Featured projects with technology tags and live demos
- **Blog & Journal**: Technical blog posts and personal development insights
- **Skills Display**: Interactive skills visualization with progress indicators
- **Document Downloads**: CV, cover letters, and certificates
- **Social Integration**: Links to GitHub, LinkedIn, and other profiles

### AI-Powered Features
- **AI Interview Prep**: Upload job descriptions and get personalized mock interview questions with model answers
- **AI Portfolio Tour**: Interactive AI guide that introduces different sections with text-to-speech
- **Smart Responses**: Context-aware AI responses based on candidate profile and experience

### Security & Performance
- **Secure Contact Form**: Cloudflare Turnstile CAPTCHA, honeypot protection, and rate limiting
- **API Security**: JWT authentication, CORS protection, and input validation
- **Performance Optimized**: Lazy loading, image optimization, and efficient caching

## 🛠 Tech Stack

### Backend
- **Framework**: Django 5.x with Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **AI Integration**: OpenAI GPT-4, ElevenLabs TTS
- **Security**: django-ratelimit, CORS headers, JWT authentication
- **Documentation**: drf-spectacular (Swagger UI)

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: TailwindCSS v4 with shadcn/ui components
- **Fonts**: DM Sans for modern typography
- **Icons**: Lucide React
- **Theme**: Light/dark mode with next-themes

### Deployment
- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Ubuntu server with Gunicorn + Nginx
- **Database**: PostgreSQL for production
- **CDN**: Cloudflare for static assets and security

## 📁 Project Structure

\`\`\`
shami-portfolio-ai/
├── backend/                     # Django REST API
│   ├── portfolio_backend/       # Django project settings
│   │   ├── settings.py         # Main configuration
│   │   ├── urls.py             # URL routing
│   │   └── wsgi.py             # WSGI application
│   ├── api/                    # API endpoints and AI features
│   │   ├── views.py            # Contact and utility views
│   │   ├── views_ai.py         # AI-powered endpoints
│   │   ├── serializers.py      # API serializers
│   │   ├── utils.py            # Security utilities
│   │   └── ai_utils.py         # AI helper functions
│   ├── portfolio/              # Portfolio content models
│   │   ├── models.py           # Data models
│   │   ├── views.py            # Portfolio API views
│   │   ├── serializers.py      # Portfolio serializers
│   │   └── fixtures/           # Sample data
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   └── manage.py              # Django management script
├── app/                        # Next.js application
│   ├── layout.tsx             # Root layout with fonts and theme
│   ├── page.tsx               # Homepage
│   ├── globals.css            # Global styles and design tokens
│   └── ai/                    # AI feature pages
│       ├── interview/         # AI Interview Prep
│       └── tour/              # AI Portfolio Tour
├── components/                 # React components
│   ├── sections/              # Homepage sections
│   ├── ai/                    # AI feature components
│   ├── ui/                    # shadcn/ui components
│   └── navigation.tsx         # Main navigation
├── lib/                       # Utility libraries
│   ├── api.ts                 # API service functions
│   ├── utils.ts               # General utilities
│   └── security.ts            # Security helpers
├── public/                    # Static assets
│   └── documents/             # Sample documents
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies
└── README.md                  # This file
\`\`\`

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/shamihonore/shami-portfolio-ai.git
cd shami-portfolio-ai
\`\`\`

### 2. Backend Setup

\`\`\`bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env file with your configuration
# Add your OpenAI API key, email settings, etc.

# Run migrations
python manage.py migrate

# Load sample data
python manage.py loaddata portfolio/fixtures/portfolio_seed.json

# Create superuser (optional)
python manage.py createsuperuser

# Start development server
python manage.py runserver
\`\`\`

The Django API will be available at `http://localhost:8000/api/`
API documentation at `http://localhost:8000/api/docs/`

### 3. Frontend Setup

\`\`\`bash
# Navigate to project root (if in backend directory)
cd ..

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your configuration
# Add API URL, Turnstile keys, etc.

# Start development server
npm run dev
\`\`\`

The Next.js application will be available at `http://localhost:3000`

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
\`\`\`env
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI Services
OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key

# Security
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
\`\`\`

#### Frontend (.env.local)
\`\`\`env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
\`\`\`

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Connect Repository**:
   - Connect your GitHub repository to Vercel
   - Vercel will automatically detect Next.js

2. **Environment Variables**:
   - Add production environment variables in Vercel dashboard
   - Set `NEXT_PUBLIC_API_URL` to your production backend URL

3. **Deploy**:
   - Vercel will automatically deploy on every push to main branch

### Backend Deployment (Ubuntu Server)

1. **Server Setup**:
\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib

# Create application user
sudo adduser portfolio
sudo usermod -aG sudo portfolio
\`\`\`

2. **Application Setup**:
\`\`\`bash
# Clone repository
git clone https://github.com/shamihonore/shami-portfolio-ai.git
cd shami-portfolio-ai/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt gunicorn psycopg2-binary

# Configure environment
cp .env.example .env
# Edit .env with production settings
\`\`\`

3. **Database Setup**:
\`\`\`bash
# Create PostgreSQL database
sudo -u postgres createdb portfolio_db
sudo -u postgres createuser portfolio_user
sudo -u postgres psql -c "ALTER USER portfolio_user WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;"

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://portfolio_user:your_password@localhost/portfolio_db
\`\`\`

4. **Gunicorn Service**:
\`\`\`bash
# Create systemd service file
sudo nano /etc/systemd/system/portfolio.service
\`\`\`

\`\`\`ini
[Unit]
Description=Portfolio Django App
After=network.target

[Service]
User=portfolio
Group=www-data
WorkingDirectory=/home/portfolio/shami-portfolio-ai/backend
Environment="PATH=/home/portfolio/shami-portfolio-ai/backend/venv/bin"
ExecStart=/home/portfolio/shami-portfolio-ai/backend/venv/bin/gunicorn --workers 3 --bind unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock portfolio_backend.wsgi:application

[Install]
WantedBy=multi-user.target
\`\`\`

5. **Nginx Configuration**:
\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock;
    }

    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock;
    }

    location /static/ {
        alias /home/portfolio/shami-portfolio-ai/backend/staticfiles/;
    }

    location /media/ {
        alias /home/portfolio/shami-portfolio-ai/backend/media/;
    }
}
\`\`\`

## 📚 API Documentation

### Portfolio Endpoints

#### Projects
- `GET /api/portfolio/projects/` - List all projects
- `GET /api/portfolio/projects/{slug}/` - Get project by slug
- **Filters**: `year`, `featured`
- **Search**: `title`, `description`, `technologies`

#### Blog Posts
- `GET /api/portfolio/blog/` - List blog posts
- `GET /api/portfolio/journal/` - List journal entries
- `GET /api/portfolio/blog/{slug}/` - Get post by slug

#### Documents
- `GET /api/portfolio/docs/` - List documents
- **Filters**: `type`, `published`

#### Social Profiles
- `GET /api/portfolio/profiles/` - List social profiles
- **Filters**: `platform`, `active`

### AI Endpoints

#### Interview Prep
\`\`\`http
POST /api/ai/interview/
Content-Type: multipart/form-data

{
  "job_description": "string",
  "audio_answer": "file (optional)"
}
\`\`\`

**Response**:
\`\`\`json
{
  "questions": ["string"],
  "model_answers": ["string"],
  "transcript": "string (optional)",
  "feedback": "string"
}
\`\`\`

#### Portfolio Tour
\`\`\`http
POST /api/ai/tour/
Content-Type: application/json

{
  "section": "home|projects|skills|blog|contact"
}
\`\`\`

**Response**:
\`\`\`json
{
  "script": "string",
  "audio_url": "string (optional)"
}
\`\`\`

### Contact Form
\`\`\`http
POST /api/contact/
Content-Type: application/json

{
  "name": "string",
  "email": "string",
  "message": "string",
  "website": "string (honeypot)",
  "turnstile_token": "string"
}
\`\`\`

## 🔒 Security Features

- **Rate Limiting**: 5 requests/minute for contact form, 10/minute for AI interview, 20/minute for AI tour
- **CAPTCHA Protection**: Cloudflare Turnstile integration
- **Honeypot Fields**: Hidden form fields to catch bots
- **Input Validation**: Server-side validation and sanitization
- **CORS Protection**: Configured allowed origins
- **JWT Authentication**: Secure admin API access

## 🧪 Testing

### Backend Tests
\`\`\`bash
cd backend
python manage.py test
\`\`\`

### Frontend Tests
\`\`\`bash
npm run test
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Iradukunda Shami Honore**
- GitHub: [@shamihonore](https://github.com/shamihonore)
- LinkedIn: [shamihonore](https://linkedin.com/in/shamihonore)
- Email: shami.honore@example.com

## 🙏 Acknowledgments

- [Django REST Framework](https://www.django-rest-framework.org/) for the robust API framework
- [Next.js](https://nextjs.org/) for the excellent React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [OpenAI](https://openai.com/) for AI capabilities
- [Cloudflare](https://www.cloudflare.com/) for security and performance

---

**Built with ❤️ by Shami Honore**
#   H o n o r e - P o r t f o l i o  
 