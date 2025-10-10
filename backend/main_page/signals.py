# from django.core.cache import cache
# from django.db.models.signals import post_save, post_delete, m2m_changed
# from django.dispatch import receiver

# from .models import ServiceCategory, ServiceFeature


# def _invalidate_services_cache() -> None:
#     """Очищает кэш для эндпоинта services/.

#     Мы используем cache_page без custom key_prefix, ключ строится на основе пути.
#     Проще всего полностью очистить alias 'default'. Если потребуется точечная
#     инвалидация, можно перейти на low-level ключи с префиксом.
#     """
#     try:
#         cache.clear()
#     except Exception:
#         # Безопасная деградация: не мешаем сохранению моделей
#         pass


# @receiver(post_save, sender=ServiceCategory)
# def invalidate_on_category_save(sender, instance, **kwargs):
#     _invalidate_services_cache()


# @receiver(post_delete, sender=ServiceCategory)
# def invalidate_on_category_delete(sender, instance, **kwargs):
#     _invalidate_services_cache()


# @receiver(post_save, sender=ServiceFeature)
# def invalidate_on_feature_save(sender, instance, **kwargs):
#     _invalidate_services_cache()


# @receiver(post_delete, sender=ServiceFeature)
# def invalidate_on_feature_delete(sender, instance, **kwargs):
#     _invalidate_services_cache()


