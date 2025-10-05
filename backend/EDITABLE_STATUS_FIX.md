# Исправление: Возможность редактирования статуса "Обработано"

## Проблема
В админке Django отображались только иконки статуса (галочки и крестики), но не было возможности их редактировать напрямую в списке. Пользователь не мог нажать на галочку "Обработано" для изменения статуса.

## Причина
Поле `is_processed` не было включено в `list_editable` из-за использования динамического отображения через методы `get_list_display()` и `get_list_editable()`.

## Решение

### 1. Добавлены статические свойства в базовый класс
```python
class FormsAdmin(BaseAdmin):
    # Переопределяем list_display и list_editable как статические свойства
    list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge', 'question_preview']
    list_editable = ['is_processed']
```

### 2. Специализированные админ-классы для каждой формы

#### ApplicationAdmin
```python
list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge']
list_editable = ['is_processed']
```

#### FreeConsultationAdmin
```python
list_display = ['name', 'phone_number', 'city', 'created_at', 'is_processed', 'status_badge', 'question_preview']
list_editable = ['is_processed']
```

#### ContactUsAdmin
```python
list_display = ['name', 'phone_number', 'created_at', 'is_processed', 'status_badge', 'question_preview']
list_editable = ['is_processed']
```

## Результат

✅ **Теперь можно редактировать статус прямо в списке:**
- В колонке "ОБРАБОТАНО" появились интерактивные чекбоксы
- Можно нажать на галочку для изменения статуса
- Изменения сохраняются автоматически при нажатии "Save"

✅ **Сохранена вся функциональность:**
- Цветные индикаторы статуса
- Предпросмотр вопросов
- Фильтры и поиск
- Массовые операции

## Как использовать

1. Откройте любую из форм обратной связи в админке
2. В колонке "ОБРАБОТАНО" найдите чекбоксы
3. Нажмите на чекбокс для изменения статуса
4. Нажмите кнопку "Save" для сохранения изменений

Теперь редактирование статуса "Обработано" работает корректно!
