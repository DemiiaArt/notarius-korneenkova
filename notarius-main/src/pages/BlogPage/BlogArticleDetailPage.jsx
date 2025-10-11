import { useParams } from "react-router-dom";
import { useBlogArticle } from "@hooks/useBlog";
import Seo from "@components/Seo/Seo";
import TemplateBlogPage from "./TemplateBlogPage";
import Loader from "@components/Loader/Loader";
import { API_BASE_URL, apiClient } from "@/config/api";
import { useState, useEffect } from "react";

/**
 * Страница отдельной статьи блога
 * Загружает данные из API по slug и отображает через TemplateBlogPage
 */
const BlogArticleDetailPage = () => {
  const { slug } = useParams();
  const { article, loading, error } = useBlogArticle(slug);

  // Состояние для прямого запроса к API
  const [politikaData, setPolitikaData] = useState(null);
  const [politikaLoading, setPolitikaLoading] = useState(false);
  const [politikaError, setPolitikaError] = useState(null);

  // Показываем загрузчик
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <Loader />
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div className="hero">
        <div className="container">
          <h1 className="fs-p--40px fw-bold c16">Помилка</h1>
          <p className="fs-p--16px c14 mt-3">{error}</p>
        </div>
      </div>
    );
  }

  // Если статья не найдена
  if (!article) {
    return (
      <div className="hero">
        <div className="container">
          <h1 className="fs-p--40px fw-bold c16">Статтю не знайдено</h1>
          <p className="fs-p--16px c14 mt-3">
            Запитувана стаття не існує або була видалена.
          </p>
        </div>
      </div>
    );
  }

  // Форматируем дату публикации
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("uk-UA", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Извлекаем теги из категорий
  const tags = article.categories?.map((cat) => cat.name) || [];

  // Парсим контент статьи
  const content = article.content;

  // Подготавливаем данные для SEO
  const articleTitle = article.title || "Без назви";
  const articleDescription =
    article.excerpt ||
    (article.content
      ? article.content.substring(0, 160).replace(/<[^>]*>/g, "")
      : "");
  const articleImage = article.hero_image;

  return (
    <>
      <Seo
        title={articleTitle}
        description={articleDescription}
        ogImage={articleImage}
        ogType="article"
        noSuffix={true}
      />
      <TemplateBlogPage
        title={articleTitle}
        content={content}
        heroImage={articleImage}
        tags={tags}
        publishDate={formatDate(article.published_at)}
      />
    </>
  );
};

export default BlogArticleDetailPage;
