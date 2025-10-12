# ✅ Чеклист для видео

## Быстрая проверка

### ❓ У меня MOV видео

```bash
# Конвертируйте в MP4:
ffmpeg -i video.mov -c:v libx264 -crf 23 -c:a aac -b:a 192k -movflags +faststart video.mp4
```

### ❓ У меня MP4, но нет звука

1. **Проверьте наличие аудио:**

   ```bash
   ffmpeg -i video.mp4 2>&1 | grep Audio
   ```

2. **Если аудио НЕТ:**
   - Ваше исходное видео без звука
   - Нужно добавить аудио из другого источника
3. **Если аудио ЕСТЬ, но не слышно:**
   ```bash
   # Перекодируйте аудио в AAC:
   ffmpeg -i video.mp4 -c:v copy -c:a aac -b:a 192k output.mp4
   ```

### ❓ Видео открывается и сразу закрывается

```bash
# Конвертируйте с правильными кодеками:
ffmpeg -i video.mov -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 192k -movflags +faststart output.mp4
```

## 🎯 Идеальные настройки

```bash
ffmpeg -i input.mov \
  -c:v libx264 \
  -preset medium \
  -crf 23 \
  -vf scale=1920:1080 \
  -c:a aac \
  -b:a 192k \
  -movflags +faststart \
  output.mp4
```

## 📋 Что проверить перед загрузкой

- [ ] Формат: MP4
- [ ] Видеокодек: H.264
- [ ] Аудиокодек: AAC
- [ ] Размер файла: < 50 МБ
- [ ] Разрешение: 1920x1080 или 1280x720
- [ ] Воспроизводится в браузере
- [ ] Звук работает

## 🔧 Инструменты

### Командная строка

- **FFmpeg:** https://ffmpeg.org/download.html

### GUI приложения

- **HandBrake:** https://handbrake.fr/ (бесплатно)
- **VLC Media Player:** Может конвертировать через Media → Convert

### Онлайн

- **CloudConvert:** https://cloudconvert.com/mov-to-mp4

## ⚡ Частые ошибки

| Ошибка                          | Причина                  | Решение                         |
| ------------------------------- | ------------------------ | ------------------------------- |
| Нет звука в MP4                 | Неправильный аудиокодек  | Перекодировать с AAC            |
| MOV не играет                   | Формат не поддерживается | Конвертировать в MP4            |
| Видео открывается и закрывается | Несовместимый кодек      | Использовать H.264              |
| Долго загружается               | Нет оптимизации          | Добавить `-movflags +faststart` |

## 🆘 Быстрая помощь

### Просмотр информации о видео:

```bash
ffmpeg -i video.mp4
```

### Проверка только аудио:

```bash
ffmpeg -i video.mp4 2>&1 | grep Audio
```

### Универсальная конвертация:

```bash
ffmpeg -i your_video.* -c:v libx264 -crf 23 -c:a aac -b:a 192k -movflags +faststart output.mp4
```

---

**Подробная инструкция:** См. `VIDEO_GUIDE.md`
