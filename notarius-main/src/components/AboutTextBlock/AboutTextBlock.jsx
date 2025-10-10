import "./AboutTextBlock.scss";
import { useIsPC } from "@hooks/isPC";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@hooks/useLanguage";
import { useTranslation } from "@hooks/useTranslation";
import { API_BASE_URL } from "@/config/api";
import { normalizeEditorHtml } from "@/utils/html";

/**
 * Функция для извлечения параграфов из HTML-строки
 * @param {string} htmlString - HTML-строка с бэкенда
 * @returns {Array<string>} - Массив параграфов
 */
const extractParagraphsFromHTML = (htmlString) => {
  if (!htmlString) return [];

  // Создаем временный элемент для парсинга HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;

  // Извлекаем все параграфы
  const paragraphs = Array.from(tempDiv.querySelectorAll("p")).map((p) =>
    p.innerHTML.trim()
  );

  // Если параграфов нет, разбиваем по <br> или возвращаем весь текст
  if (paragraphs.length === 0) {
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    // Разбиваем по двойным переносам строк или <br><br>
    const parts = textContent
      .split(/\n\n+|<br\s*\/?>\s*<br\s*\/?>/)
      .map((part) => part.trim())
      .filter(Boolean);

    return parts.length > 0 ? parts : [htmlString];
  }

  return paragraphs;
};

export const AboutTextBlock = () => {
  const isPC = useIsPC();
  const { currentLang } = useLanguage();
  const { t } = useTranslation("components.AboutTextBlock");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";
    fetch(`${API_BASE_URL}/about-me/detail/?lang=${lang}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load aboutTextBlock document");
        return r.json();
      })
      .then((data) => {
        console.log(data);
        setTitle(data?.title || "");
        setContent(data?.text || "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentLang]);

  const [isMobileView, setIsMobileView] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      const isMobile = window.innerWidth <= 1024;
      setIsMobileView(isMobile);

      if (!isMobile) {
        setExpanded(true);
      } else {
        setExpanded(false);
      }
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

const normalizedHtml = useMemo(() => normalizeEditorHtml(content), [content]);

  return (
    <div className="about-container">
      <div className="container container-1200">
        <h2 className={`${isPC ? "fs-h2--32px" : "fs-h2--20px"} fw-bold`}>
          {title}
        </h2>

        <div className={`about-content text-content-html ${expanded ? "expanded" : ""}`}>
          {loading ? (
            <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"} lh-150`}>
              {t("loading")}
            </p>
          ) : error ? (
            <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"} lh-150`}>
              {t("error")}
            </p>
          ) : (
            <div
              className={`${isPC ? "fs-p--16px" : "fs-p--14px"} lh-150`}
              dangerouslySetInnerHTML={{ __html: normalizedHtml }}
            />
          )}
        </div>

        {false && isMobileView && (
          <button
            className={`accordion-toggle toggle-btn ${isPC ? "fs-p--20px" : "fs-p--16px"}`}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? t("hide") : t("showMore")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AboutTextBlock;
