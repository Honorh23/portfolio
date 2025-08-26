# Deployment Guide

This guide covers deploying the Shami Portfolio AI application to production environments.

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub repository
- Vercel account

### Steps

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Environment Variables**
   \`\`\`
   NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your-turnstile-site-key
   \`\`\`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Custom Domain (Optional)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed

## Backend Deployment (Ubuntu Server)

### Server Requirements
- Ubuntu 20.04 LTS or newer
- 2GB RAM minimum
- 20GB storage minimum
- Python 3.11+

### Initial Server Setup

\`\`\`bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install python3 python3-pip python3-venv nginx postgresql postgresql-contrib supervisor git

# Create application user
sudo adduser portfolio
sudo usermod -aG sudo portfolio
\`\`\`

### Database Setup

\`\`\`bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH PASSWORD 'secure_password_here';
ALTER ROLE portfolio_user SET client_encoding TO 'utf8';
ALTER ROLE portfolio_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE portfolio_user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
\q
\`\`\`

### Application Deployment

\`\`\`bash
# Switch to portfolio user
sudo su - portfolio

# Clone repository
git clone https://github.com/shamihonore/shami-portfolio-ai.git
cd shami-portfolio-ai/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install gunicorn psycopg2-binary

# Configure environment
cp .env.example .env
nano .env
\`\`\`

### Environment Configuration

Edit `.env` file:
\`\`\`env
SECRET_KEY=your-very-secure-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

DATABASE_URL=postgresql://portfolio_user:secure_password_here@localhost/portfolio_db

CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

OPENAI_API_KEY=your-openai-api-key
ELEVENLABS_API_KEY=your-elevenlabs-api-key
TURNSTILE_SECRET_KEY=your-turnstile-secret-key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
\`\`\`

### Django Setup

\`\`\`bash
# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Load sample data
python manage.py loaddata portfolio/fixtures/portfolio_seed.json

# Create superuser
python manage.py createsuperuser

# Test the application
python manage.py runserver 0.0.0.0:8000
\`\`\`

### Gunicorn Configuration

Create Gunicorn configuration file:
\`\`\`bash
nano /home/portfolio/shami-portfolio-ai/backend/gunicorn.conf.py
\`\`\`

\`\`\`python
bind = "unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock"
workers = 3
user = "portfolio"
group = "www-data"
timeout = 120
keepalive = 5
max_requests = 1000
max_requests_jitter = 100
preload_app = True
\`\`\`

### Supervisor Configuration

Create supervisor configuration:
\`\`\`bash
sudo nano /etc/supervisor/conf.d/portfolio.conf
\`\`\`

\`\`\`ini
[program:portfolio]
command=/home/portfolio/shami-portfolio-ai/backend/venv/bin/gunicorn portfolio_backend.wsgi:application -c /home/portfolio/shami-portfolio-ai/backend/gunicorn.conf.py
directory=/home/portfolio/shami-portfolio-ai/backend
user=portfolio
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/portfolio.log
\`\`\`

Start supervisor:
\`\`\`bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start portfolio
\`\`\`

### Nginx Configuration

Create Nginx site configuration:
\`\`\`bash
sudo nano /etc/nginx/sites-available/portfolio
\`\`\`

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location /api/ {
        include proxy_params;
        proxy_pass http://unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /admin/ {
        include proxy_params;
        proxy_pass http://unix:/home/portfolio/shami-portfolio-ai/backend/portfolio.sock;
    }

    location /static/ {
        alias /home/portfolio/shami-portfolio-ai/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /home/portfolio/shami-portfolio-ai/backend/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
\`\`\`

Enable the site:
\`\`\`bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
\`\`\`

### SSL Certificate (Let's Encrypt)

\`\`\`bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test automatic renewal
sudo certbot renew --dry-run
\`\`\`

### Monitoring and Maintenance

#### Log Files
- Application logs: `/var/log/portfolio.log`
- Nginx logs: `/var/log/nginx/access.log` and `/var/log/nginx/error.log`
- System logs: `sudo journalctl -u supervisor`

#### Useful Commands
\`\`\`bash
# Restart application
sudo supervisorctl restart portfolio

# Check application status
sudo supervisorctl status portfolio

# View logs
sudo tail -f /var/log/portfolio.log

# Update application
cd /home/portfolio/shami-portfolio-ai
git pull origin main
source backend/venv/bin/activate
pip install -r backend/requirements.txt
python backend/manage.py migrate
python backend/manage.py collectstatic --noinput
sudo supervisorctl restart portfolio
\`\`\`

## Database Backup

Create backup script:
\`\`\`bash
nano /home/portfolio/backup.sh
\`\`\`

\`\`\`bash
#!/bin/bash
BACKUP_DIR="/home/portfolio/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -h localhost -U portfolio_user portfolio_db > $BACKUP_DIR/db_backup_$DATE.sql

# Media files backup
tar -czf $BACKUP_DIR/media_backup_$DATE.tar.gz -C /home/portfolio/shami-portfolio-ai/backend media/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
\`\`\`

Make executable and add to crontab:
\`\`\`bash
chmod +x /home/portfolio/backup.sh
crontab -e
# Add: 0 2 * * * /home/portfolio/backup.sh
\`\`\`

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if Gunicorn is running: `sudo supervisorctl status portfolio`
   - Check socket file permissions: `ls -la /home/portfolio/shami-portfolio-ai/backend/portfolio.sock`

2. **Static Files Not Loading**
   - Run: `python manage.py collectstatic --noinput`
   - Check Nginx configuration for static files path

3. **Database Connection Error**
   - Verify PostgreSQL is running: `sudo systemctl status postgresql`
   - Check database credentials in `.env` file

4. **CORS Errors**
   - Verify `CORS_ALLOWED_ORIGINS` in backend `.env`
   - Check frontend API URL configuration

### Performance Optimization

1. **Enable Gzip Compression**
   Add to Nginx configuration:
   \`\`\`nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   \`\`\`

2. **Database Optimization**
   \`\`\`sql
   -- Add indexes for frequently queried fields
   CREATE INDEX idx_project_featured ON portfolio_project(featured);
   CREATE INDEX idx_blogpost_kind ON portfolio_blogpost(kind);
   CREATE INDEX idx_blogpost_published ON portfolio_blogpost(published);
   \`\`\`

3. **Redis Caching** (Optional)
   \`\`\`bash
   sudo apt install redis-server
   pip install django-redis
   \`\`\`

   Add to Django settings:
   \`\`\`python
   CACHES = {
       'default': {
           'BACKEND': 'django_redis.cache.RedisCache',
           'LOCATION': 'redis://127.0.0.1:6379/1',
           'OPTIONS': {
               'CLIENT_CLASS': 'django_redis.client.DefaultClient',
           }
       }
   }
   \`\`\`

This completes the deployment setup for both frontend and backend components of the Shami Portfolio AI application.
