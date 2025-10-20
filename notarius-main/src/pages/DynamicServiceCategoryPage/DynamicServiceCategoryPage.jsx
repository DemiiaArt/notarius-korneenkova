/**
 * Универсальная страница для динамических категорий услуг из админки
 * Автоматически загружает данные на основе URL
 */

import { useServiceCategoryPage } from "@/hooks/useServiceCategoryPage";
import TemplatePage from "@pages/secondLevel/TemplatePage";
import { useIsPC } from "@hooks/isPC";
import Seo from "@components/Seo/Seo";
import { useSeo } from "@hooks/useSeo";
import Skeleton from "@components/Skeleton/Skeleton";

const DynamicServiceCategoryPage = () => {
  const { category, loading, error, lang } = useServiceCategoryPage();
  const isPC = useIsPC();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: isPC ? "18px" : "16px",
        }}
      >
        Завантаження...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: isPC ? "18px" : "16px",
          color: "#e74c3c",
        }}
      >
        Помилка: {error}
      </div>
    );
  }

  if (!category) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
          fontSize: isPC ? "18px" : "16px",
        }}
      >
        Категорію не знайдено
      </div>
    );
  }

  // Преобразуем HTML описание в формат content для TemplatePage
  const content =
    category.description && category.description[lang]
      ? [
          {
            type: "html",
            html: category.description[lang],
          },
        ]
      : [];

  const title =
    category.label && category.label[lang] ? category.label[lang] : "Послуга";

  console.log(`📄 DynamicServiceCategoryPage category:`, {
    id: category?.id,
    label: category?.label,
    seo_title: category?.seo_title,
    seo_description: category?.seo_description,
    lang,
  });

  // SEO параметры
  const seoProps = useSeo({
    navId: category?.id,
    title: category?.seo_title?.[lang] || title,
    description:
      category?.seo_description?.[lang] || "Нотаріальні послуги у Дніпрі",
  });

  // Показываем skeleton пока navTree не загружен (для страниц, зависящих от navTree)
  if (seoProps.shouldShowSkeleton) {
    return <Skeleton message="Завантаження навігаційного дерева..." />;
  }

  return (
    <>
      <Seo {...seoProps} />
      <TemplatePage
        title={title}
        content={content}
        heroImgClass="service-category-hero"
      />
    </>
  );
};

export default DynamicServiceCategoryPage;
