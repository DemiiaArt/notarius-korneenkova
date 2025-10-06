import { lazy, Suspense, memo } from "react";
import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";
import "./OtherServicesPage.scss";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";

const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);

const OtherServicesPage = () => {
  const { data, loading, error } = usePageData("other-services");

  return (
    <PageTemplate
      pageData={data}
      loading={loading}
      error={error}
      wrapperClassName="translate-wrap"
    >
      <AdaptiveCarousel parentId="other-services" title="Інші послуги" />
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

export default OtherServicesPage;
