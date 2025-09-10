#!/usr/bin/env python
import os
import sys
import django

# Добавляем путь к проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Пароль для суперпользователя
ADMIN_PASSWORD = 'admin12345'

# Создаем суперпользователя
if not User.objects.filter(username='admin').exists():
    user = User.objects.create_superuser(
        username='admin12',
        email='admin@example.com',
        password=ADMIN_PASSWORD
    )
    print('=' * 50)
    print('SUPERUSER CREATED SUCCESSFULLY!')
    print('=' * 50)
    print(f'Username: admin')
    print(f'Password: {ADMIN_PASSWORD}')
    print(f'Email: admin@example.com')
    print('=' * 50)
    print('Use these credentials to access Django admin')
    print('=' * 50)
else:
    print('=' * 50)
    print('SUPERUSER ALREADY EXISTS!')
    print('=' * 50)
    admin_user = User.objects.filter(username='admin').first()
    if admin_user:
        print(f'Username: {admin_user.username}')
        print(f'Password: {ADMIN_PASSWORD} (password used during creation)')
        print(f'Email: {admin_user.email}')
        print(f'Is superuser: {admin_user.is_superuser}')
        print(f'Is active: {admin_user.is_active}')
        print('=' * 50)
        print('Use these credentials to access Django admin')
        print('=' * 50)