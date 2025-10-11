from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import ServiceCategory


def _invalidate_services_cache() -> None:
    """Очищает кэш для эндпоинта services/."""
    try:
        cache.clear()
    except Exception:
        # Безопасная деградация: не мешаем сохранению моделей
        pass


@receiver(post_save, sender=ServiceCategory)
def invalidate_on_category_save(sender, instance, **kwargs):
    _invalidate_services_cache()


@receiver(post_delete, sender=ServiceCategory)
def invalidate_on_category_delete(sender, instance, **kwargs):
    _invalidate_services_cache()


