import { useTranslation } from "react-i18next";
import { useIsPC } from "@hooks/isPC";
// import videoTest from "@media/video_test.mov"; // Закомментируем
import { useEffect } from "react";
import "./MainVideo.scss";

const MainVideo = ({ lang }) => {
  const isPC = useIsPC();
  const { t, i18n } = useTranslation();

  const baseUrl = import.meta.env.VITE_BASE_URL;

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
      <video className="main-video-player" autoPlay muted loop playsInline>
        <source src="https://example.com/placeholder-video.mp4" type="video/mp4" />
        Ваш браузер не поддерживает тег video.
      </video>

      {/* <div className="main-video-text">Ваш заголовок поверх видео</div> */}
    </div>
  );
};

export default MainVideo;
