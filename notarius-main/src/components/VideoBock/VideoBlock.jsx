import "./VideoBlock.scss";
import { useState, useRef } from "react";
import { useIsPC } from "@hooks/isPC";
import { useBackgroundVideos } from "@hooks/useBackgroundVideos";
import { motion, AnimatePresence } from "framer-motion";

export const VideoBlock = ({ title, description }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);
  
  // Получаем видео из бэкенда
  const { videos, loading, getVideoUrl } = useBackgroundVideos();
  
  // Определяем источник видео: из бэкенда или fallback
  const getVideoSource = () => {
    if (videos.length > 0) {
      const firstVideo = videos[0];
      return getVideoUrl(firstVideo.video);
    }
    return null; // Если нет видео из бэкенда, не показываем видео
  };

  const handlePlay = () => {
    const videoSource = getVideoSource();
    if (!videoSource) {
      console.warn('Нет доступного видео для воспроизведения');
      return;
    }
    
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

  const isPC = useIsPC();
  const videoSource = getVideoSource();

  // Если загружается или нет видео, показываем только контент без кнопки воспроизведения
  if (loading || !videoSource) {
    return (
      <div className="video-block">
        <div className="video-block-preview" />
        <div className="video-block-content container">
          <div className="video-block-text">
            <h2
              className={` uppercase fw-bold ${isPC ? "fs-h2--32px" : "fs-h2--20px"}`}
            >
              {title}
            </h2>
            <p className={` ${isPC ? "fs-p--24px" : "fs-p--16px"} lh-150`}>
              {description}
            </p>
          </div>
          {loading && (
            <div className="video-loading-message">
              Загрузка видео...
            </div>
          )}
          {!loading && !videoSource && (
            <div className="video-no-video-message">
              Видео не найдено
            </div>
          )}
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
            src={videoSource}
            autoPlay
            controls
            className="video-block-video"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onEnded={handleStop}
            onError={(e) => {
              console.error('Ошибка загрузки видео:', e);
              handleStop();
            }}
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
                {title}
              </h2>
              <p className={` ${isPC ? "fs-p--24px" : "fs-p--16px"} lh-150`}>
                {description}
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
              <span>Дивитись відео</span>
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
