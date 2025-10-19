"""
Signals для блога - импортируем основные сигналы из main_page
"""
# Импортируем сигналы из main_page, чтобы они работали для всех моделей
from main_page.signals import regenerate_sitemap_debounced
