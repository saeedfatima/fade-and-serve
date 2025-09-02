# Barber Shop - Production Ready Backend

A complete Django REST API with PostgreSQL, cart system, VIP bookings, and Render deployment configuration.

## Quick Deploy to Render

1. **Fork this repository**
2. **Create Render account** and connect GitHub
3. **Use render.yaml** - automatically creates database and web service
4. **Set environment variables** in Render dashboard:
   - `SECRET_KEY` (auto-generated)
   - `ALLOWED_HOSTS` (your-app.onrender.com)
   - `CORS_ALLOWED_ORIGINS` (your-frontend-domain.com)

## Features Added

- **Cart System**: Server-side cart with credit top-ups
- **VIP Bookings**: Admin can toggle VIP status on any booking
- **Home Service**: Toggle availability per service with time slots
- **New Equipment**: Badge system with surcharge options
- **Enhanced Admin**: Sidebar navigation with collapsible design
- **Production Ready**: WhiteNoise, dj-database-url, Gunicorn

## API Endpoints

```
POST /api/cart/add/           # Add to cart
GET  /api/cart/              # Get cart
POST /api/credit-topups/     # Add credit
GET  /api/service-availability/ # Available slots
PATCH /api/bookings/{id}/    # Update booking (VIP, status)
```

## Local Development

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py runserver 8000
```

## Frontend Integration

Updated React app with:
- Admin sidebar navigation (`/admin`)
- VIP toggle switches
- Cart management
- Service availability display
- Responsive design with mobile hamburger menu

Deploy frontend to Netlify/Vercel and set `VITE_API_BASE_URL` to your Render backend URL.