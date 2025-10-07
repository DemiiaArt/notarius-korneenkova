import { useIsPC } from "@hooks/isPC";
import "./TradeMarkPage.scss";

export default function PdfFrame({ src, zoom = 75, view = null }) {
  const isPC = useIsPC();

  if (!src) {
    return (
      <div className="pdf-frame-error">
        <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          PDF файл не знайдено
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

  return (
    <div className="pdf-frame-container">
      <iframe
        src={pdfUrl}
        className="pdf-frame"
        title="PDF Document Viewer"
        type="application/pdf"
      >
        <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
          Ваш браузер не підтримує відображення PDF.{" "}
          <a href={src} download className="pdf-download-link">
            Завантажити PDF
          </a>
        </p>
      </iframe>
    </div>
  );
}
