# 🚀 Инструкция по настройке и запуску проекта

## 📁 Структура проекта

```
Dc/
├── backend/              # Django REST API
│   ├── backend/          # Настройки проекта
│   ├── main_page/        # Основное приложение
│   └── manage.py
└── notarius-main/        # React фронтенд
    ├── src/
    ├── package.json
    └── vite.config.js
```

---

## 🔧 Настройка Backend (Django)

### 1. Установка зависимостей

```bash
cd backend

# Создайте виртуальное окружение (если еще не создано)
python -m venv venv

# Активируйте виртуальное окружение
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt
```

### 2. Настройка базы данных

Создайте файл `.env` в папке `backend/`:

```env
# Django settings
SECRET_KEY=your-secret-key-here
DEBUG=True

# Database (PostgreSQL)
POSTGRES_DB=notarius
PGUSER=postgres
PGPASSWORD=your-password
PGHOST=localhost
PGPORT=5432
```

### 3. Миграции

```bash
# Применить миграции
python manage.py migrate

# Создать суперпользователя для админки
python manage.py createsuperuser
```

### 4. Запуск сервера

```bash
python manage.py runserver
```

Backend будет доступен по адресу: `http://localhost:8000`
Админ-панель: `http://localhost:8000/admin/`

---

## 🎨 Настройка Frontend (React + Vite)

### 1. Установка зависимостей

```bash
cd notarius-main

# Установите зависимости
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env` в папке `notarius-main/`:

```env
# Development
VITE_API_BASE_URL=http://localhost:8000/api
```

Для production измените на:
```env
# Production
VITE_API_BASE_URL=https://your-domain.com/api
```

### 3. Запуск dev-сервера

```bash
npm run dev
```

Frontend будет доступен по адресу: `http://localhost:5173`

### 4. Сборка для production

```bash
npm run build
```

---

## 🧪 Проверка работы системы отзывов

### 1. Backend
1. Откройте `http://localhost:8000/admin/`
2. Войдите с учетными данными суперпользователя
3. Перейдите в раздел "Отзывы"

### 2. Frontend
1. Откройте страницу с формой отзывов
2. Заполните форму:
   - Выберите рейтинг (звезды)
   - Введите имя
   - Выберите услугу
   - Напишите текст отзыва
3. Нажмите "ВІДПРАВИТИ"

### 3. Модерация
1. Вернитесь в админку Django
2. Найдите новый отзыв
3. Установите флаги:
   - ✅ Одобрено
   - ✅ Опубликовано
4. Сохраните

### 4. Проверка отображения
1. Обновите страницу с отзывами
2. Отзыв должен появиться в карусели
3. Статистика рейтинга должна обновиться

---

## 📝 API Endpoints

После запуска backend доступны следующие endpoints:

- `GET /api/reviews/` - список опубликованных отзывов
- `POST /api/reviews/create/` - создание отзыва
- `GET /api/reviews/stats/` - статистика рейтинга
- `GET /api/reviews/admin/` - все отзывы (для админов)
- `GET/PUT/DELETE /api/reviews/<id>/` - управление отзывом

Полная документация: [REVIEWS_SYSTEM.md](./REVIEWS_SYSTEM.md)

---

## 🛠️ Полезные команды

### Backend (Django)

```bash
# Создать новую миграцию
python manage.py makemigrations

# Применить миграции
python manage.py migrate

# Создать суперпользователя
python manage.py createsuperuser

# Собрать статические файлы
python manage.py collectstatic

# Запустить shell
python manage.py shell

# Запустить тесты
python manage.py test
```

### Frontend (React)

```bash
# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Проверка линтера
npm run lint
```

---

## 🐛 Troubleshooting

### Backend не запускается

**Ошибка: `SECRET_KEY environment variable is not set!`**
- Создайте файл `.env` в папке `backend/`
- Добавьте `SECRET_KEY=ваш-секретный-ключ`

**Ошибка: `relation "main_page_review" does not exist`**
- Выполните: `python manage.py migrate`

**Ошибка: `FATAL: password authentication failed`**
- Проверьте настройки PostgreSQL в `.env`
- Убедитесь, что PostgreSQL запущен

### Frontend не запускается

**Ошибка: `Cannot find module '@/config/api'`**
- Убедитесь, что файл `src/config/api.js` существует
- Перезапустите dev-сервер

**CORS ошибки**
- Убедитесь, что backend запущен
- Проверьте настройки CORS в `backend/settings.py`

### Отзывы не отображаются

1. **Проверьте backend:**
   - Откройте `http://localhost:8000/api/reviews/`
   - Убедитесь, что отзывы возвращаются

2. **Проверьте модерацию:**
   - Откройте админку
   - Убедитесь, что отзывы одобрены и опубликованы

3. **Проверьте консоль браузера:**
   - Откройте DevTools (F12)
   - Посмотрите на ошибки в консоли

---

## 📚 Дополнительная информация

- [Документация по системе отзывов](./REVIEWS_SYSTEM.md)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)

---

## ✅ Checklist для запуска

### Backend
- [ ] Установлены зависимости (`pip install -r requirements.txt`)
- [ ] Создан файл `.env` с настройками
- [ ] PostgreSQL запущен
- [ ] Применены миграции (`python manage.py migrate`)
- [ ] Создан суперпользователь (`python manage.py createsuperuser`)
- [ ] Сервер запущен (`python manage.py runserver`)

### Frontend
- [ ] Установлены зависимости (`npm install`)
- [ ] Создан файл `.env` с `VITE_API_BASE_URL`
- [ ] Dev-сервер запущен (`npm run dev`)

### Проверка
- [ ] Админка доступна (`http://localhost:8000/admin/`)
- [ ] API отвечает (`http://localhost:8000/api/reviews/`)
- [ ] Frontend открывается (`http://localhost:5173`)
- [ ] Форма отзывов работает
- [ ] Отзывы отображаются после модерации

---

## 🎉 Готово!

Если все шаги выполнены, система отзывов полностью настроена и готова к использованию!

Для вопросов см. раздел [Troubleshooting](#-troubleshooting).

