import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from main_page.models import ServiceCategory
from main_page.serializer import ServiceCategorySerializer

print("=" * 80)
print("ПРОВЕРКА SERVICECATEGORY")
print("=" * 80)

# Статистика
total = ServiceCategory.objects.count()
in_menu = ServiceCategory.objects.filter(show_in_menu=True).count()
root_cats = ServiceCategory.objects.filter(parent__isnull=True, show_in_menu=True)

print(f"\nВсего категорий: {total}")
print(f"В меню: {in_menu}")
print(f"Корневых: {root_cats.count()}")

print("\nСписок корневых категорий:")
for cat in root_cats:
    print(f"  - {cat.nav_id}: {cat.label_ua}")
    children = cat.get_children().filter(show_in_menu=True)
    for child in children:
        print(f"      → {child.nav_id}: {child.label_ua}")
        grandchildren = child.get_children().filter(show_in_menu=True)
        for gc in grandchildren:
            print(f"          → {gc.nav_id}: {gc.label_ua}")

# Тест сериализатора
print("\nТест сериализатора:")
serializer = ServiceCategorySerializer(root_cats, many=True)
data = serializer.data
print(f"Сериализовано: {len(data)} корневых элементов")

if data:
    first = data[0]
    print(f"\nПервая категория:")
    print(f"  ID: {first['id']}")
    print(f"  Label UA: {first['label']['ua']}")
    print(f"  Kind: {first['kind']}")
    print(f"  Show in menu: {first['show_in_menu']}")
    print(f"  Children: {len(first['children'])}")

print("\n" + "=" * 80)

