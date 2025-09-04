import { useTranslation } from "react-i18next";
import { useIsPC } from "@hooks/isPC";
import { useBackgroundVideos } from "@hooks/useBackgroundVideos";
import { useEffect } from "react";
import "./MainVideo.scss";

const MainVideo = ({ lang }) => {
  const isPC = useIsPC();
  const { t, i18n } = useTranslation();
  const { videos, loading, getVideoUrl } = useBackgroundVideos();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  // Получаем видео из бэкенда
  const getVideoSource = () => {
    if (videos.length > 0) {
      const firstVideo = videos[0];
      return getVideoUrl(firstVideo.video);
    }
    return null;
  };

  const videoSource = getVideoSource();

  // useEffect(() => {
  //   if (lang) {
  //     i18n.changeLanguage(lang);
  //   }
  // }, [lang, i18n]);

  // const urlMap = {
  //   ua: `${baseUrl}/`,
  //   en: `${baseUrl}/en/`,
  //   ru: `${baseUrl}/ru/`,
  // };

  return (
    <div className="main-video">
      {loading ? (
        <div className="main-video-loading">
          Загрузка видео...
        </div>
      ) : videoSource ? (
        <video className="main-video-player" autoPlay muted loop playsInline>
          <source src={videoSource} type="video/mp4" />
          <source src={videoSource} type="video/webm" />
          Ваш браузер не поддерживает тег video.
        </video>
      ) : (
        <div className="main-video-no-video">
          Видео не найдено
        </div>
      )}

      {/* <div className="main-video-text">Ваш заголовок поверх видео</div> */}
    </div>
  );
};

export default MainVideo;
