#!/usr/bin/env python
import os
import sys
import django
from pathlib import Path

# Добавляем путь к проекту
BASE_DIR = Path(__file__).resolve().parent
sys.path.append(str(BASE_DIR))

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

try:
    django.setup()
    print("✅ Django setup successful")
    
    from django.conf import settings
    print(f"✅ SECRET_KEY: {'Set' if settings.SECRET_KEY else 'Not set'}")
    print(f"✅ DEBUG: {settings.DEBUG}")
    print(f"✅ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
    # Проверка базы данных
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT 1")
    print("✅ Database connection successful")
    
    # Проверка админки
    from django.contrib.auth import get_user_model
    from django.contrib.admin.sites import site
    from django.contrib.admin import AdminSite
    
    User = get_user_model()
    print(f"✅ User model: {User}")
    print(f"✅ Admin site: {site}")
    print(f"✅ Admin site registered models: {len(site._registry)}")
    
    # Проверка суперпользователя
    admin_users = User.objects.filter(is_superuser=True)
    print(f"✅ Superusers count: {admin_users.count()}")
    for user in admin_users:
        print(f"   - {user.username} (email: {user.email})")
    
    # Проверка URL админки
    from django.urls import reverse
    try:
        admin_url = reverse('admin:index')
        print(f"✅ Admin URL: {admin_url}")
    except Exception as e:
        print(f"❌ Admin URL error: {e}")
    
    print("✅ All admin checks passed!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1) 