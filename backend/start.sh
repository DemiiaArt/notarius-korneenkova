#!/bin/bash
echo "Starting Django application..."

# Проверяем переменные окружения
echo "SECRET_KEY: ${SECRET_KEY:0:10}..."
echo "DEBUG: $DEBUG"
echo "DATABASE_HOST: $DATABASE_HOST"

# Собираем статические файлы
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Применяем миграции
echo "Running migrations..."
python manage.py migrate

# Запускаем сервер
echo "Starting Gunicorn..."
exec gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT --timeout 120 