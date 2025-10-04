"""
Скрипт для тестирования API ServiceCategory
Запуск: python manage.py shell < test_service_category_api.py
"""

from main_page.models import ServiceCategory
from main_page.serializer import ServiceCategorySerializer
import json

print("=" * 80)
print("ПРОВЕРКА SERVICECATEGORY")
print("=" * 80)

# 1. Проверка количества категорий
total = ServiceCategory.objects.count()
in_menu = ServiceCategory.objects.filter(show_in_menu=True).count()
root_cats = ServiceCategory.objects.filter(parent__isnull=True, show_in_menu=True)

print(f"\n📊 Статистика:")
print(f"   Всего категорий: {total}")
print(f"   Показывается в меню: {in_menu}")
print(f"   Корневых категорий: {root_cats.count()}")

# 2. Вывод всех категорий в меню
print(f"\n📝 Категории в меню:")
for cat in ServiceCategory.objects.filter(show_in_menu=True).order_by('order'):
    indent = "  " * cat.level
    parent_info = f" (parent: {cat.parent.nav_id})" if cat.parent else " (ROOT)"
    print(f"   {indent}[{cat.kind}] {cat.nav_id}: {cat.label_ua}{parent_info}")

# 3. Проверка сериализации
print(f"\n🔍 Проверка сериализатора:")
if root_cats.exists():
    serializer = ServiceCategorySerializer(root_cats, many=True)
    data = serializer.data
    print(f"   Сериализовано {len(data)} корневых категорий")
    
    # Вывод первой категории для примера
    if data:
        print(f"\n📄 Пример первой категории:")
        first = data[0]
        print(f"   ID: {first['id']}")
        print(f"   Kind: {first['kind']}")
        print(f"   Label UA: {first['label']['ua']}")
        print(f"   Slug UA: {first['slug']['ua']}")
        print(f"   Show in menu: {first['show_in_menu']}")
        print(f"   Children: {len(first['children'])} шт.")
        
        # Если есть дети, покажем первого
        if first['children']:
            child = first['children'][0]
            print(f"\n   Первый дочерний элемент:")
            print(f"      ID: {child['id']}")
            print(f"      Label UA: {child['label']['ua']}")
            print(f"      Children: {len(child['children'])} шт.")
    
    # Сохраним в файл для проверки
    with open('service_categories_test.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ Данные сохранены в service_categories_test.json")
else:
    print("   ⚠️  Нет корневых категорий!")

# 4. Проверка структуры для фронтенда
print(f"\n🌐 Проверка для фронтенда:")
print("   Категории должны быть в формате:")
print("   {")
print("     'id': 'nav_id',")
print("     'kind': 'page/group/section',")
print("     'label': {'ua': '...', 'ru': '...', 'en': '...'},")
print("     'slug': {'ua': '...', 'ru': '...', 'en': '...'},")
print("     'show_in_menu': True/False,")
print("     'component': None,")
print("     'children': [...]")
print("   }")

print("\n" + "=" * 80)
print("ТЕСТ ЗАВЕРШЕН")
print("=" * 80)

