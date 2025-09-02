# Deployment Guide - Barber Shop App

This guide covers deployment for both the Django REST API backend and React frontend.

## Backend Deployment (Django)

### Option 1: Local Development
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py loaddata fixtures/initial_services.json
python manage.py runserver 8000
```

### Option 2: Docker Deployment
```bash
cd backend
docker-compose up --build
```

### Option 3: Production (Railway/Heroku)
1. Create a new project on Railway.app or Heroku
2. Connect your GitHub repository
3. Set environment variables:
   - `SECRET_KEY=your-secret-key`
   - `DEBUG=False`
   - `ALLOWED_HOSTS=your-domain.com,your-domain.railway.app`
   - `DB_NAME=your-db-name`
   - `DB_USER=your-db-user`
   - `DB_PASSWORD=your-db-password`
   - `DB_HOST=your-db-host`
   - `DB_PORT=5432`

4. Add a PostgreSQL service
5. Deploy!

## Frontend Deployment (React)

### Option 1: Netlify
1. Build the project: `npm run build`
2. Drag and drop the `dist` folder to Netlify
3. Set environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

### Option 2: Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`
3. Deploy!

### Option 3: Traditional Hosting
1. Build the project: `npm run build`
2. Upload the contents of the `dist` folder to your web server
3. Configure your web server to serve the index.html for all routes

## Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-domain.com,localhost
DB_NAME=barber_shop
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```

## Database Migration

Run these commands to set up the database:
```bash
python manage.py migrate
python manage.py loaddata fixtures/initial_services.json
python manage.py createsuperuser  # Optional: Create admin user
```

## CORS Configuration

Make sure to update the CORS settings in `backend/barber_shop/settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "https://your-frontend-domain.com",
    "http://localhost:8080",  # For development
]
```

## Security Checklist
- [ ] Set `DEBUG=False` in production
- [ ] Use a strong `SECRET_KEY`
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Set up proper CORS origins
- [ ] Use HTTPS in production
- [ ] Set up proper database credentials
- [ ] Enable database backups