import AdaptiveCarousel from "@components/AdaptiveCarousel/AdaptiveCarousel";
import "./ServicesPage.scss";
import PageTemplate from "@components/PageTemplate/PageTemplate";
import { usePageData } from "@hooks/usePageData";
import { lazy, Suspense } from "react";
const Comments = lazy(() => import("@components/Comments/Comments"));
const HowIWork = lazy(() => import("@components/HowIWork/HowIWork"));
const ReviewForm = lazy(() => import("@components/ReviewForm/ReviewForm"));
const Form = lazy(() => import("@components/Form/Form"));
const OftenQuestions = lazy(
  () => import("@components/OftenQuestions/OftenQuestions")
);

const ServicesPage = () => {
  // Используем универсальный хук с navId из nav-tree
  const { data, loading, error } = usePageData("services");

  return (
    <PageTemplate pageData={data} loading={loading} error={error}>
      <AdaptiveCarousel parentId="services" title="ВИДИ НОТАРІАЛЬНИХ ПОСЛУГ" />
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

export default ServicesPage;
