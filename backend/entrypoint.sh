#!/bin/bash

# Exit on any error
set -e

echo "Running database migrations..."
python manage.py migrate --noinput

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Loading initial data..."
python manage.py loaddata fixtures/initial_services.json || echo "Initial data already loaded or file not found"

echo "Starting Gunicorn server..."
exec gunicorn barber_shop.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 3