import NotaryServices from "@components/NotaryServices/NotaryServices";
import Loader from "@components/Loader/Loader";
import { buildMediaUrl } from "@/config/api";
import { normalizeAndConvertHtml } from "@/utils/html";
/**
 * Универсальный шаблон страницы с NotaryServices и контентом
 * @param {Object} props
 * @param {Object} props.pageData - Данные страницы из usePageData
 * @param {boolean} props.loading - Состояние загрузки
 * @param {string} props.error - Ошибка загрузки
 * @param {string} props.wrapperClassName - CSS класс для обертки (опционально)
 * @param {React.ReactNode} props.children - Дополнительный контент после текста
 */
const PageTemplate = ({
  pageData,
  loading,
  error,
  wrapperClassName = "",
  children,
}) => {
  // Нормализуем hero_image, чтобы избежать двойного /media
  const heroImageUrl = pageData?.hero_image ? buildMediaUrl(pageData.hero_image) : null;
  return (
    <>
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
