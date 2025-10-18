import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";
import Form from "@components/Form/Form";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";

/**
 * Дефолтна сторінка 3-го рівня з динамічним контентом з backend
 *
 * Використовується як fallback коли:
 * - В ServiceGroupPage немає кастомного компонента
 * - В nav-tree не вказаний component для сторінки
 *
 * Автоматично завантажує дані з backend через usePageData
 *
 * @param {string} navId - ID сторінки з nav-tree.js (обов'язковий!)
 * @param {string} wrapperClassName - CSS клас для wrapper (опціонально)
 *
 * @example
 * <DefaultThirdLevelPage navId="power-of-attorney" />
 */
const DefaultThirdLevelPage = ({
  navId,
  wrapperClassName = "default-third-level-wrap",
}) => {
  // Завантажуємо дані з backend на основі navId
  const { data, loading, error } = usePageData(navId);

  return (
    <PageTemplate
      pageData={data}
      loading={loading}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      {/* На 3-му рівні показуємо дітей поточного розділу (або верхній рівень, якщо дітей немає) */}
      <AdaptiveCarousel parentId={navId} title="Інші послуги" />
      <OftenQuestions navId={navId} />
      <Form />
    </PageTemplate>
  );
};

export default DefaultThirdLevelPage;
