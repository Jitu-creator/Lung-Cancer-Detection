#!/bin/bash
python proj1/manage.py migrate --noinput
python proj1/manage.py collectstatic --noinput --clear
gunicorn proj1.proj1.wsgi:application --bind 0.0.0.0:$PORT
