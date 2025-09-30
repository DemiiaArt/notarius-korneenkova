import { useState, useRef, useEffect } from "react";
import "./MainVideo.scss";
import videoAny from "@media/video_test.mov"; // fallback, якщо поки лише .mov

const MainVideo = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // 1) Вмикаємо завантаження, коли блок з’являється поблизу екрана
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          io.unobserve(el); // достатньо одноразово
        }
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 2) Авто play/pause залежно від видимості (економія ресурсів)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || typeof IntersectionObserver === "undefined") return;

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
  }, [shouldLoadVideo]);

  return (
    <div className="main-video" ref={containerRef}>
      {shouldLoadVideo ? (
        <video
          ref={videoRef}
          className={`main-video-player ${isVideoLoaded ? "is-loaded" : ""}`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setIsVideoLoaded(true)}
          aria-label="Фонове відео головного екрану"
        >
          {/* Якщо маєш різні формати — додай кілька <source> зверху вниз */}
          {/* <source src={videoWebm} type="video/webm" /> */}
          {/* <source src={videoMp4} type="video/mp4" /> */}
          <source src={videoAny} />
          Ваш браузер не підтримує тег <code>video</code>.
        </video>
      ) : (
        <div className="main-video-placeholder">
          <div className="loading-spinner">Завантаження відео…</div>
        </div>
      )}
    </div>
  );
};

export default MainVideo;
