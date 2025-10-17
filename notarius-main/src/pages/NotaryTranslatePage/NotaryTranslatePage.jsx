import { lazy, Suspense } from "react";
import "./NotaryTranslatePage.scss";
import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

// Lazy load heavy components
const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);

const NotaryTranslatePage = () => {
  // Используем универсальный хук с navId из nav-tree
  const { data, loading, error } = usePageData("notary-translate");

  return (
    <PageTemplate
      pageData={data}
      loading={loading}
      error={error}
      wrapperClassName="translate-wrap"
    >
      <AdaptiveCarousel parentId="notary-translate" title="Послуги перекладу" />
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
        <OftenQuestions navId="notary-translate" />
      </Suspense>
    </PageTemplate>
  );
};

export default NotaryTranslatePage;
