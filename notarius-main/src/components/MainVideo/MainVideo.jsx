import { useState, useRef, useEffect } from "react";
import "./MainVideo.scss";
import videoAny from "@media/video_test.mp4"; // fallback
import { API_BASE_URL } from "@/config/api.js";
import ScrollDownButton from "@components/ScrollDownButton/ScrollDownButton";

const MainVideo = () => {
  const [isMediaLoaded, setIsMediaLoaded] = useState(false);
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [mediaData, setMediaData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Загружаем данные с API
  useEffect(() => {
    const fetchBackgroundMedia = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/background-videos/`);
        if (!response.ok) {
          throw new Error("Failed to fetch background media");
        }
        const data = await response.json();

        // Берём первый активный элемент
        const activeMedia = data.find((item) => item.is_active) || data[0];

        if (activeMedia && activeMedia.media_url) {
          setMediaData(activeMedia);
        } else {
          // Если нет данных с сервера, показываем сообщение
          setMediaData(null);
        }
      } catch (err) {
        console.error("Error loading background media:", err);
        setError(err.message);
        // При ошибке также показываем сообщение
        setMediaData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackgroundMedia();
  }, []);

  // 1) Вмикаємо завантаження, коли блок з'являється поблизу екрана
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadMedia(true);
          io.unobserve(el); // достатньо одноразово
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2) Авто play/pause залежно від видимості (тільки для відео)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !mediaData || mediaData.media_type !== "video") return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(vid);
    return () => io.disconnect();
  }, [shouldLoadMedia, mediaData]);

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="main-video" ref={containerRef}>
        <div className="main-video-placeholder">
          <div className="loading-spinner">Завантаження…</div>
        </div>
      </div>
    );
  }

  // Если нет данных - показываем сообщение
  if (!mediaData) {
    return (
      <div className="main-video" ref={containerRef}>
        <div className="main-video-placeholder main-video-placeholder--no-media">
          <div className="no-media-message">
            <svg
              className="no-media-icon"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <h3 className="no-media-title">Медіа не завантажено</h3>
            <p className="no-media-description">
              Будь ласка, завантажте відео або зображення в адмін-панелі
            </p>
          </div>
          <ScrollDownButton />
        </div>
      </div>
    );
  }

  return (
    <div className="main-video" ref={containerRef}>
      {shouldLoadMedia ? (
        <>
          {mediaData.media_type === "video" ? (
            <video
              ref={videoRef}
              className={`main-video-player ${isMediaLoaded ? "is-loaded" : ""}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onLoadedData={() => setIsMediaLoaded(true)}
              aria-label="Фонове відео головного екрану"
            >
              <source src={mediaData.media_url} />
              Ваш браузер не підтримує тег <code>video</code>.
            </video>
          ) : (
            <img
              src={mediaData.media_url}
              alt="Фонове зображення"
              className={`main-video-image ${isMediaLoaded ? "is-loaded" : ""}`}
              onLoad={() => setIsMediaLoaded(true)}
              aria-label="Фонове зображення головного екрану"
            />
          )}
          <ScrollDownButton />
        </>
      ) : (
        <div className="main-video-placeholder">
          <div className="loading-spinner">Завантаження медіа…</div>
        </div>
      )}
    </div>
  );
};

export default MainVideo;
