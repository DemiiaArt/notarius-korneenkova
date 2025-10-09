import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "./TradeMarkPage.scss";

export default function PdfFrame({ src, zoom = 75, view = null }) {
  const isPC = useIsPC();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (!src) {
    return (
      <div className="pdf-frame-error">
        <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          {t("pages.TradeMarkPage.pdfNotFound")}
        </p>
      </div>
    );
  }

  // Формируем URL с параметрами масштабирования
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
