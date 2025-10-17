import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";
import { lazy, Suspense } from "react";
import { usePageData } from "@hooks/usePageData";
import PageTemplate from "@components/PageTemplate/PageTemplate";

const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);

const ConsultationPage = () => {
  const { data, loading, error } = usePageData("consult-copy-duplicate");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <AdaptiveCarousel
        parentId="consult-copy-duplicate"
        title="Консультації. Копії. Дублікати"
      />
      <Suspense fallback={<div>Завантаження...</div>}>
        <HowIWork />
      </Suspense>
      <Suspense fallback={<div>Завантаження...</div>}>
        <Comments />
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
        <OftenQuestions navId="consult-copy-duplicate" />
      </Suspense>
    </PageTemplate>
  );
};

export default ConsultationPage;
