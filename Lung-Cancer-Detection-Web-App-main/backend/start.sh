#!/bin/bash
python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear

# Auto-create admin if credentials are provided
if [ -n "$ADMIN_USERNAME" ] && [ -n "$ADMIN_PASSWORD" ]; then
  echo "from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.filter(username='$ADMIN_USERNAME').exists() or User.objects.create_superuser('$ADMIN_USERNAME', '${ADMIN_EMAIL:-admin@example.com}', '$ADMIN_PASSWORD')" | python manage.py shell
fi

gunicorn proj1.wsgi:application --bind 0.0.0.0:$PORT --timeout 300 --workers 1
