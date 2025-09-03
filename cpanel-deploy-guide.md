# cPanel Deployment Guide

## Prerequisites
- cPanel hosting account with Node.js support
- Separate backend hosting (API) or use the Django backend on a VPS

## Frontend Deployment (React App)

### Step 1: Build the Project
```bash
npm ci
npm run build
```

### Step 2: Upload Files
1. Upload all contents of the `dist` folder to your cPanel `public_html` directory
2. Upload the `.htaccess` file (included in public folder) to `public_html`

### Step 3: Environment Configuration
Create a `.env.production` file before building:
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Step 4: Domain Configuration
- Point your domain to the cPanel hosting
- Ensure `.htaccess` is in place for client-side routing

## Backend Options for cPanel

### Option 1: Separate VPS/Cloud (Recommended)
Deploy the Django backend to:
- DigitalOcean Droplet
- AWS EC2
- Railway.app
- Heroku
- Render.com

### Option 2: cPanel with Python (if supported)
Some cPanel hosts support Python applications:

1. Upload backend files to a subdirectory (e.g., `api/`)
2. Install dependencies: `pip install -r requirements.txt`
3. Configure database connection
4. Set up WSGI application

### Option 3: Node.js Backend Alternative
If your cPanel supports Node.js but not Python:
- Consider converting to a Node.js/Express backend
- Or use the existing Django backend on a separate service

## File Structure on cPanel
```
public_html/
├── index.html
├── assets/
│   ├── css files
│   └── js files
├── .htaccess
└── (other static files)
```

## Troubleshooting
- Ensure `.htaccess` is uploaded for client-side routing
- Check that CORS is properly configured on your backend
- Verify API endpoints are accessible from your domain
- Test with browser developer tools for network issues