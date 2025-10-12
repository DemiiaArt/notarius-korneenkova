import "./VideoBlock.scss";
import { useState, useRef, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { useLanguage } from "@hooks/useLanguage";
import { API_BASE_URL, buildMediaUrl } from "@/config/api";
import { motion, AnimatePresence } from "framer-motion";

export const VideoBlock = ({ title, description, pageType }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [serverTitle, setServerTitle] = useState("");
  const [serverDescription, setServerDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef(null);
  const { getTranslations } = useTranslation("components.VideoBlock");
  const { currentLang } = useLanguage();

  // Получаем переводы для компонента
  const translations = getTranslations();
  const { playButton } = translations;

  // Получаем переводы для конкретной страницы
  const pageTranslations = pageType ? translations[pageType] : null;
  const translatedTitle = serverTitle || pageTranslations?.title || title;
  const translatedDescription =
    serverDescription || pageTranslations?.description || description;

  useEffect(() => {
    let cancelled = false;
    async function loadVideoData() {
      setIsLoading(true);
      try {
        const lang = ["ua", "ru", "en"].includes(currentLang)
          ? currentLang
          : "ua";

        // Определяем тип видео на основе pageType
        let videoType = "interview"; // по умолчанию
        if (pageType === "aboutPage") {
          videoType = "about_me";
        } else if (pageType === "contactsPage") {
          videoType = "contacts";
        }

        // Запрашиваем данные в зависимости от типа
        const resp = await fetch(
          `${API_BASE_URL}/video-blocks/?type=${videoType}&lang=${encodeURIComponent(lang)}`
        );
        if (!resp.ok) {
          if (cancelled) return;
          setHasVideo(false);
          setIsLoading(false);
          return;
        }
        const data = await resp.json();
        if (cancelled) return;
        const first = Array.isArray(data) ? data[0] : null;
        if (first && first.video_url) {
          // предпочитаем стрим эндпойнт
          const streamUrl = first.id
            ? `${API_BASE_URL}/video-blocks/${first.id}/stream/`
            : null;
          setVideoUrl(streamUrl || buildMediaUrl(first.video_url));
          setServerTitle(first.title || "");
          setServerDescription(first.description || "");
          setHasVideo(true);
        } else {
          setVideoUrl("");
          setServerTitle("");
          setServerDescription("");
          setHasVideo(false);
        }
      } catch (err) {
        console.error("Error loading video block:", err);
        if (cancelled) return;
        setHasVideo(false);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }
    loadVideoData();
    return () => {
      cancelled = true;
    };
  }, [currentLang, pageType]);

  const handlePlay = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setShowVideo(true);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 600); // ждать завершения анимации ухода текста+кнопки
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setShowVideo(false); // сразу показываем превью
    setIsPlaying(false); // сразу возвращаем текст/кнопку
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setVideoError(true);
    setShowVideo(false);
    setIsPlaying(false);
  };

  const isPC = useIsPC();

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="video-block">
        <div className="video-block-preview" />
        <div className="video-block-content container">
          <div className="video-block-loading">
            <div className="loading-spinner">Завантаження відео...</div>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение если видео нет
  if (!hasVideo || !videoUrl) {
    return (
      <div className="video-block">
        <div className="video-block-preview" />
        <div className="video-block-content container">
          <div className="video-block-no-video">
            <svg
              className="no-video-icon"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <h3 className="no-video-title">Відео не завантажено</h3>
            <p className="no-video-description">
              Будь ласка, додайте відео в адмін-панелі для цього типу блоку
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем сообщение об ошибке воспроизведения
  if (videoError) {
    return (
      <div className="video-block">
        <div className="video-block-preview" />
        <div className="video-block-content container">
          <div className="video-block-no-video">
            <svg
              className="no-video-icon"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <h3 className="no-video-title">Помилка відтворення відео</h3>
            <p className="no-video-description">
              Формат відео не підтримується браузером. Рекомендуємо
              використовувати MP4 (H.264/AAC)
            </p>
            <button
              className="retry-button"
              onClick={() => {
                setVideoError(false);
                setIsPlaying(false);
                setShowVideo(false);
              }}
            >
              Спробувати знову
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-block">
      {/* Превью */}
      <AnimatePresence>
        {!showVideo && (
          <motion.div
            key="preview"
            className="video-block-preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        )}
      </AnimatePresence>
      {/* Видео */}
      <AnimatePresence>
        {showVideo && (
          <motion.video
            key="video"
            ref={videoRef}
            src={videoUrl}
            autoPlay
            controls
            className="video-block-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onEnded={handleStop}
            onError={handleVideoError}
            playsInline
            // Звук включен (без muted)
          />
        )}
      </AnimatePresence>

      {/* Текст и кнопка */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            key="content"
            className="video-block-content container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="video-block-text"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2
                className={` uppercase fw-bold ${isPC ? "fs-h2--32px" : "fs-h2--20px"}`}
              >
                {translatedTitle}
              </h2>
              <p className={` ${isPC ? "fs-p--24px" : "fs-p--16px"} lh-150`}>
                {translatedDescription}
              </p>
            </motion.div>

            <motion.button
              className={`video-block-button c1 ${isPC ? "fs-p--20px" : "fs-p--14px"}`}
              onClick={handlePlay}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span>{playButton || "Дивитись відео"}</span>
              <svg
                width="100"
                height="100"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M50 0C22.3861 0 0 22.3857 0 50C0 77.6143 22.3861 100 50 100C77.6139 100 100 77.6143 100 50C100 22.3857 77.6139 0 50 0ZM67.2812 52.6504L42.2812 68.2754C41.7754 68.5912 41.2002 68.75 40.625 68.75C40.1039 68.75 39.582 68.6203 39.1098 68.3578C38.1164 67.807 37.5 66.7617 37.5 65.625V34.375C37.5 33.2383 38.1164 32.193 39.1098 31.6422C40.1031 31.0883 41.3178 31.1219 42.2812 31.7246L67.2812 47.3496C68.1945 47.9219 68.75 48.9229 68.75 50C68.75 51.0771 68.1945 52.0783 67.2812 52.6504Z"
                  // fill="#FCFCFC"
                />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoBlock;
