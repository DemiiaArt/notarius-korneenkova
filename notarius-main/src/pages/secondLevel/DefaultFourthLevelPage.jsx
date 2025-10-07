import { lazy, Suspense } from "react";
import { usePageData } from "@hooks/usePageData";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";

// Lazy load компонентов
const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);
/**
 * Дефолтна сторінка 4-го рівня з динамічним контентом з backend
 *
 * Використовується як fallback коли:
 * - В nav-tree не вказаний component для сторінки 4-го рівня
 * - В component-registry немає компонента для даного ID
 *
 * Автоматично завантажує дані з backend через usePageData
 *
 * @param {string} navId - ID сторінки з nav-tree.js (обов'язковий!)
 * @param {string} wrapperClassName - CSS клас для wrapper (опціонально)
 *
 * @example
 * <DefaultFourthLevelPage navId="poa-property" />
 */
const DefaultFourthLevelPage = ({
  navId,
  wrapperClassName = "default-fourth-level-wrap",
}) => {
  const { data, loading, error } = usePageData(navId);

  return (
    <PageTemplate
      pageData={data}
      loading={loading}
      error={error}
      wrapperClassName={wrapperClassName}
    >
      <AdaptiveCarousel parentId={navId} title="Апостиль на документи" />
      <Suspense fallback={<div>Завантаження...</div>}>
        <HowIWork />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Comments />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <ReviewForm />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Form />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <OftenQuestions />
      </Suspense>
    </PageTemplate>
  );
};

export default DefaultFourthLevelPage;
