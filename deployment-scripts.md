# Deployment Scripts and Commands

## Local Development Setup

### Backend (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your local database settings
python manage.py migrate
python manage.py loaddata fixtures/initial_services.json
python manage.py runserver 8000
```

### Frontend (React)
```bash
npm ci
npm run dev
```

## Production Build Commands

### Frontend Build for cPanel
```bash
# Set production environment
echo "VITE_API_BASE_URL=https://your-api-domain.com/api" > .env.production

# Build for production
npm ci --production=false
npm run build

# Files will be in ./dist folder - upload these to cPanel public_html
```

### Backend Build for Production
```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate --noinput
```

## Render Deployment

### Automatic Deployment
```bash
# Push to GitHub, Render will auto-deploy using render.yaml
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Manual Render Setup
1. Connect GitHub repository
2. Create Web Service for backend:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && ./entrypoint.sh`
3. Create Static Site for frontend:
   - Build Command: `npm ci && npm run build`
   - Publish Directory: `dist`

## Environment Variables

### Production Environment Variables
```bash
# Backend (.env)
SECRET_KEY=your-secret-key-here
DEBUG=False
DATABASE_URL=postgresql://user:password@host:port/dbname
ALLOWED_HOSTS=your-domain.com,your-app.onrender.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# Frontend (.env.production)
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Health Checks

### Backend Health Check
```bash
curl https://your-backend-domain.com/api/health/
```

### Frontend Health Check
```bash
curl https://your-frontend-domain.com/
```

## Backup Commands

### Database Backup
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Media Files Backup
```bash
tar -czf media_backup_$(date +%Y%m%d_%H%M%S).tar.gz backend/media/
```