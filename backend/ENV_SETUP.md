# Настройка переменных окружения

## Создайте файл `.env` в папке `backend/` со следующим содержимым:

```env
# Django Settings
SECRET_KEY=your-secret-key-here-generate-with-django
DEBUG=True

# Database Settings (PostgreSQL)
POSTGRES_DB=notarius
PGUSER=postgres
PGPASSWORD=your-password-here
PGHOST=localhost
PGPORT=5432
```

## Для production (Railway):

```env
SECRET_KEY=your-production-secret-key
DEBUG=False
PGHOST=your-railway-postgres-host
POSTGRES_DB=railway
PGUSER=postgres
PGPASSWORD=your-railway-password
PGPORT=5432
```

## Генерация SECRET_KEY:

Запустите в Python:
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

Или используйте:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

