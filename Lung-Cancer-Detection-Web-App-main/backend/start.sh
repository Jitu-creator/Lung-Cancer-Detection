#!/bin/bash
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear
gunicorn proj1.wsgi:application --bind 0.0.0.0:$PORT
