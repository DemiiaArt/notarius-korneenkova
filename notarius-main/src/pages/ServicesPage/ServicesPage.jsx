import NotaryServices from "@components/NotaryServices/NotaryServices";
import ServicesCarousel from "@components/ServicesCarousel/ServicesCarousel";
import GroupServicesCarousel from "@components/GroupServicesCarousel/GroupServicesCarousel";
import Comments from "@components/Comments/Comments";
import HowIWork from "@components/HowIWork/HowIWork";
import Questions from "@components/Questions/Questions";
import ReviewForm from "@components/ReviewForm/ReviewForm";
import Form from "@components/Form/Form";
import contentImg from "@media/text-content-img.png";
import "./ServicesPage.scss";
import OftenQuestions from "@components/OftenQuestions/OftenQuestions";
import { useIsPC } from "@hooks/isPC";
import { useLang } from "@nav/use-lang";
import { fetchPageDataBySlug } from "@utils/api";
import { useEffect, useState } from "react";
import Loader from "@components/Loader/Loader";

const ServicesPage = () => {
  const isPC = useIsPC();
  const { currentLang } = useLang();
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // UA slug for Services section from nav-tree
    const uaSlug = "services/notarialni-poslugy";

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPageDataBySlug({
          slug: uaSlug,
          lang: currentLang,
        });
        console.log("[ServicesPage] fetched data:", data);
        setServiceData(data);
      } catch (e) {
        console.error("[ServicesPage] fetch error:", e);
        setError(e.message || "Fetch error");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [currentLang]);

  return (
    <>
      <NotaryServices
        title={serviceData?.title}
        listItems={serviceData?.listItems}
        heroImageUrl={serviceData?.hero_image || null}
      />

      {loading && !serviceData && (
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
      <div className="template-text-content">
        <div className="container">
          <article className="text-content">
            {serviceData?.description && (
              <div
                className="text-content-html"
                dangerouslySetInnerHTML={{ __html: serviceData.description }}
              />
            )}
          </article>
        </div>
      </div>
      <GroupServicesCarousel
        parentId="services"
        title="ВИДИ НОТАРІАЛЬНИХ ПОСЛУГ"
        kind="group"
      />
      {/* <Questions /> */}
      <HowIWork />
      <Comments />
      <ReviewForm />
      <Form />
      <OftenQuestions />
    </>
  );
};

export default ServicesPage;
