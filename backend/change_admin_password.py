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

print("=" * 60)
print("CHANGING ADMIN PASSWORD")
print("=" * 60)

# Ищем существующего пользователя admin
admin_user = User.objects.filter(username='admin').first()

if admin_user:
    print(f"✅ Found admin user: {admin_user.username}")
    print(f"Current status:")
    print(f"  - Is superuser: {admin_user.is_superuser}")
    print(f"  - Is staff: {admin_user.is_staff}")
    print(f"  - Is active: {admin_user.is_active}")
    
    # Устанавливаем новый пароль
    new_password = 'admin123451'
    admin_user.set_password(new_password)
    
    # Убеждаемся что пользователь имеет все нужные права
    admin_user.is_superuser = True
    admin_user.is_staff = True
    admin_user.is_active = True
    admin_user.save()
    
    print(f"\n✅ Password changed successfully!")
    print(f"Username: {admin_user.username}")
    print(f"New password: {new_password}")
    print(f"Email: {admin_user.email}")
    print(f"Is superuser: {admin_user.is_superuser}")
    print(f"Is staff: {admin_user.is_staff}")
    print(f"Is active: {admin_user.is_active}")
    
    # Тестируем аутентификацию
    from django.contrib.auth import authenticate
    test_user = authenticate(username='admin', password=new_password)
    if test_user:
        print("\n✅ Authentication test passed!")
    else:
        print("\n❌ Authentication test failed!")
        
else:
    print("❌ Admin user not found!")
    print("Available users:")
    for user in User.objects.all():
        print(f"  - {user.username} (superuser: {user.is_superuser}, staff: {user.is_staff})")

print("=" * 60) 