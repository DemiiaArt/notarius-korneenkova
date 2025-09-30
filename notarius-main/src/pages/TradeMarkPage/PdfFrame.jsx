import { useState, useEffect } from "react";

export default function PdfFrame({ src }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const maxRetries = 3;
  const url = `${src}#page=${1}&zoom=${75}`;

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    // Додаємо таймаут для перевірки завантаження
    const timeout = setTimeout(() => {
      if (retryCount < maxRetries) {
        setRetryCount((prev) => prev + 1);
        setIsLoading(false);
      } else {
        setError(true);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [retryCount]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
  };

  const handleError = () => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
    } else {
      setError(true);
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          margin: "0 0 170px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
          padding: "40px",
          textAlign: "center",
        }}
      >
        <h3>Не вдалося завантажити PDF файл</h3>
        <p>Спробуйте один з наведених нижче способів:</p>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: "10px 20px",
              backgroundColor: "#338d96",
              color: "white",
              textDecoration: "none",
              borderRadius: "5px",
              fontWeight: "bold",
            }}
          >
            Відкрити PDF в новій вкладці
          </a>
          <button
            onClick={() => {
              setRetryCount(0);
              setError(false);
              setIsLoading(true);
            }}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f5f5",
              color: "#333",
              border: "1px solid #ccc",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        margin: "0 0 170px 0",
      }}
    >
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <div
            className="pdf-loading-spinner"
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #f3f3f3",
              borderTop: "4px solid #338d96",
              borderRadius: "50%",
              margin: "0 auto 10px",
            }}
          ></div>
          <p>Завантаження PDF файлу...</p>
        </div>
      )}

      <object
        data={url}
        type="application/pdf"
        style={{
          width: "100%",
          minHeight: "100vh",
          opacity: isLoading ? 0.3 : 1,
          transition: "opacity 0.3s ease",
        }}
        onLoad={handleLoad}
        onError={handleError}
      >
        <iframe
          src={url}
          style={{
            width: "100%",
            minHeight: "100vh",
            border: "none",
          }}
          onLoad={handleLoad}
          onError={handleError}
        >
          <p>
            Ваш браузер не може відобразити PDF файл.
            <a href={src} target="_blank" rel="noopener noreferrer">
              Відкрити PDF в новій вкладці
            </a>
          </p>
        </iframe>
      </object>
    </div>
  );
}
