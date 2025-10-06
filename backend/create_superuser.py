#!/usr/bin/env python
"""
Скрипт для создания суперпользователя в Railway
"""
import os
import sys
import django

# Добавляем путь к проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

def create_superuser():
    """Создает суперпользователя если его нет"""
    try:
        # Проверяем, есть ли уже суперпользователь
        if User.objects.filter(is_superuser=True).exists():
            print("Superuser already exists")
            return
        
        # Создаем суперпользователя
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')
        
        User.objects.create_superuser(username, email, password)
        print(f"Superuser '{username}' created successfully")
        
    except Exception as e:
        print(f"Error creating superuser: {e}")

if __name__ == '__main__':
    create_superuser()
