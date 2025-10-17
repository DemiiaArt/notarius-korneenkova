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

const ApostillePage = () => {
  const { data, loading, error } = usePageData("apostille-affidavit");
  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <AdaptiveCarousel
        parentId="apostille-affidavit"
        title="АПОСТИЛЬ ТА АФІДЕВІТ"
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
        <OftenQuestions navId="apostille-affidavit" />
      </Suspense>
    </PageTemplate>
  );
};

export default ApostillePage;
