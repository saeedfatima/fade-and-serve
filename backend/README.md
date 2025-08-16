# Django Barber Shop Backend

This is the Django REST API backend for the YUSTIKUM Barber Shop application.

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Environment Configuration
```bash
cp .env.example .env
# Edit .env file with your database credentials and settings
```

### 4. Database Setup
Make sure PostgreSQL is installed and running, then create a database:
```sql
CREATE DATABASE barber_shop;
```

### 5. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Load Initial Data
```bash
python manage.py loaddata fixtures/initial_services.json
```

### 7. Create Superuser
```bash
python manage.py createsuperuser
```

### 8. Run Development Server
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET/PATCH /api/auth/profile/` - Get/Update user profile

### Services
- `GET /api/services/` - List all active services

### Bookings
- `GET /api/bookings/` - List user's bookings (or all for staff)
- `POST /api/bookings/create/` - Create new booking
- `GET/PATCH/DELETE /api/bookings/{id}/` - Manage specific booking

## User Roles
- `user` - Regular customers (default)
- `staff` - Barber staff members
- `admin` - Full administrative access

## Admin Interface
Access the Django admin at `http://localhost:8000/admin/` to manage:
- Users and roles
- Services
- Bookings
- System settings