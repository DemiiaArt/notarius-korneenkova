import { useState, useRef, useEffect } from "react";
import "./MainVideo.scss";
// Убираем импорт видео
import videoTest from "@media/NotaryTranslateHero.jpg";

const MainVideo = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(true); // Сразу считаем загруженным
  const [shouldLoadVideo, setShouldLoadVideo] = useState(true); // Сразу показываем

  const containerRef = useRef(null);

  // Убираем все useEffect для видео, так как теперь используем заглушку

  return (
    <div className="main-video" ref={containerRef}>
      {/* Заменяем видео на изображение */}
      <img
        className={`main-video-player ${isVideoLoaded ? "is-loaded" : ""}`}
        src={videoTest}
        alt="Головне зображення"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        aria-label="Головне зображення замість відео"
      />
    </div>
  );
};

export default MainVideo;
