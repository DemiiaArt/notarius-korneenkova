import { memo, lazy, Suspense } from "react";
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
 * Страница "Апостиль на документи" (4 уровень)
 * URL: /notarialni-poslugi/apostyl-afidavit/apostyl-na-dokumenty
 *
 * Использует PageTemplate для динамической загрузки контента из backend
 */
const ApostilleDocs = memo(() => {
  const { data, loading, error } = usePageData("apostille-documents");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <AdaptiveCarousel
        parentId="apostille-documents"
        title="Апостиль на документи"
      />
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
});

ApostilleDocs.displayName = "ApostilleDocs";

export default ApostilleDocs;
