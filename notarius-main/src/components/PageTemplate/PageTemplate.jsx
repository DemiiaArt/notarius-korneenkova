import NotaryServices from "@components/NotaryServices/NotaryServices";
import JsonLdSchema from "@components/Seo/JsonLdSchema";
import Loader from "@components/Loader/Loader";
import { normalizeAndConvertHtml } from "@/utils/html";
import { BACKEND_BASE_URL } from "@/config/api";
import { useServiceJsonLd } from "@hooks/useServiceJsonLd";

/**
 * Универсальный шаблон страницы с NotaryServices и контентом
 * @param {Object} props
 * @param {Object} props.pageData - Данные страницы из usePageData
 * @param {boolean} props.loading - Состояние загрузки
 * @param {string} props.error - Ошибка загрузки
 * @param {string} props.wrapperClassName - CSS класс для обертки (опционально)
 * @param {string} props.navId - ID элемента навигации для JSON-LD (опционально)
 * @param {React.ReactNode} props.children - Дополнительный контент после текста
 */
const PageTemplate = ({
  pageData,
  loading,
  error,
  wrapperClassName = "",
  navId,
  children,
}) => {
  // Получаем API URL для JSON-LD, если передан navId
  const jsonLdApiUrl = useServiceJsonLd(navId);
  const heroImageUrl = `${BACKEND_BASE_URL}${pageData?.hero_image}`;
  return (
    <>
      {/* JSON-LD Schema для страниц услуг */}
      {jsonLdApiUrl && <JsonLdSchema apiUrl={jsonLdApiUrl} />}

      <div className={wrapperClassName}>
        <NotaryServices
          title={pageData?.title}
          listItems={pageData?.listItems}
          heroImageUrl={pageData?.hero_image ? heroImageUrl : null}
        />
        {loading && !pageData && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "24px 0",
            }}
          >
            <Loader size="medium" variant="spinner" message="Завантаження..." />
          </div>
        )}
        {error && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "24px 0",
              color: "red",
            }}
          >
            Помилка: {error}
          </div>
        )}
      </div>

      {/* Контент страницы */}
      <div className="template-text-content">
        <div className="container">
          <article className="text-content">
            {pageData?.description && (
              <div
                className="text-content-html"
                dangerouslySetInnerHTML={{
                  __html: normalizeAndConvertHtml(pageData.description),
                }}
              />
            )}
          </article>
        </div>
      </div>

      {/* Дополнительный контент (карусели, формы и т.д.) */}
      {children}
    </>
  );
};

export default PageTemplate;
