import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "./TradeMarkPage.scss";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Настройка worker для react-pdf
// Используем новый URL для импорта worker через Vite
const pdfjsWorker = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

// Функция для определения iOS/Safari
const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

const isSafari = () => {
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
};

export default function PdfFrame({ src, zoom = 75, view = null }) {
  const isPC = useIsPC();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [pageWidth, setPageWidth] = useState(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Используем react-pdf для iOS/Safari и мобильных устройств
  const useReactPdf = !isPC || isIOS() || isSafari();

  useEffect(() => {
    // Устанавливаем ширину контейнера при монтировании и изменении размера окна
    const updateWidth = () => {
      const container = document.querySelector(".pdf-frame-container");
      if (container) {
        setContainerWidth(container.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    // Вычисляем ширину страницы в зависимости от размера экрана
    if (containerWidth > 0) {
      // Оставляем небольшой отступ (20px) с каждой стороны на мобильных
      const padding = isPC ? 40 : 20;
      setPageWidth(containerWidth - padding);
    }
  }, [containerWidth, isPC]);

  if (!src) {
    return (
      <div className="pdf-frame-error">
        <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          {t("pages.TradeMarkPage.pdfNotFound")}
        </p>
      </div>
    );
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setHasError(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF load error:", error);
    setIsLoading(false);
    setHasError(true);
  };

  // Для iOS/Safari и мобильных устройств используем react-pdf
  if (useReactPdf) {
    return (
      <div className="pdf-frame-container">
        {isLoading && (
          <div className="pdf-loading-overlay">
            <div className="pdf-loading-spinner"></div>
            <p
              className={`pdf-loading-text ${isPC ? "fs-p--16px" : "fs-p--14px"}`}
            >
              {t("pages.TradeMarkPage.loading")}
            </p>
          </div>
        )}

        {hasError && (
          <div className="pdf-frame-error">
            <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
              {t("pages.TradeMarkPage.loadError")}{" "}
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-download-link"
              >
                {t("pages.TradeMarkPage.downloadFile")}
              </a>
            </p>
          </div>
        )}

        <div className="pdf-document-wrapper">
          <Document
            file={src}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<div></div>}
            error={<div></div>}
          >
            {!isLoading && !hasError && numPages && (
              <>
                {Array.from(new Array(numPages), (el, index) => (
                  <div key={`page_${index + 1}`} className="pdf-page-wrapper">
                    <Page
                      pageNumber={index + 1}
                      width={pageWidth}
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                      className="pdf-page"
                    />
                  </div>
                ))}
              </>
            )}
          </Document>
        </div>

        {!isLoading && !hasError && (
          <div className="pdf-download-section">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="pdf-download-button"
            >
              {t("pages.TradeMarkPage.downloadPdf")}
            </a>
          </div>
        )}
      </div>
    );
  }

  // Для десктопа (не Safari) используем iframe
  let pdfUrl = src;
  if (view) {
    pdfUrl += `#view=${view}`;
  } else if (zoom) {
    pdfUrl += `#zoom=${zoom}`;
  }

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="pdf-frame-container">
      {isLoading && (
        <div className="pdf-loading-overlay">
          <div className="pdf-loading-spinner"></div>
          <p
            className={`pdf-loading-text ${isPC ? "fs-p--16px" : "fs-p--14px"}`}
          >
            {t("pages.TradeMarkPage.loading")}
          </p>
        </div>
      )}

      {hasError && (
        <div className="pdf-frame-error">
          <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
            {t("pages.TradeMarkPage.loadError")}{" "}
            <a href={src} download className="pdf-download-link">
              {t("pages.TradeMarkPage.downloadFile")}
            </a>
          </p>
        </div>
      )}

      <iframe
        src={pdfUrl}
        className={`pdf-frame ${isLoading ? "pdf-frame--loading" : ""}`}
        title="PDF Document Viewer"
        type="application/pdf"
        onLoad={handleLoad}
        onError={handleError}
      >
        <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          {t("pages.TradeMarkPage.browserNotSupported")}{" "}
          <a href={src} download className="pdf-download-link">
            {t("pages.TradeMarkPage.downloadPdf")}
          </a>
        </p>
      </iframe>
    </div>
  );
}
