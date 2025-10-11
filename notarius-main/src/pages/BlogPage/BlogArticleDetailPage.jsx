import { useParams } from "react-router-dom";
import { useBlogArticle } from "@hooks/useBlog";
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

  // Преобразуем HTML контент в формат для TemplateBlogPage
  // const parseContent = (htmlContent) => {
  //   if (!htmlContent) return [];

  //   // Создаем временный элемент для парсинга HTML
  //   const parser = new DOMParser();
  //   const doc = parser.parseFromString(htmlContent, "text/html");
  //   const elements = Array.from(doc.body.children);

  //   return elements.map((el) => {
  //     const tagName = el.tagName.toLowerCase();

  //     if (tagName === "h2" || tagName === "h3" || tagName === "h4") {
  //       return {
  //         type: "title",
  //         text: el.textContent,
  //       };
  //     }

  //     if (tagName === "p") {
  //       return {
  //         type: "paragraph",
  //         text: el.textContent,
  //       };
  //     }

  //     if (tagName === "ul" || tagName === "ol") {
  //       return {
  //         type: "list",
  //         items: Array.from(el.querySelectorAll("li")).map(
  //           (li) => li.textContent
  //         ),
  //       };
  //     }

  //     if (tagName === "img") {
  //       let src = el.getAttribute("src");
  //       // Обрабатываем относительные пути к изображениям
  //       if (src && !src.startsWith("http")) {
  //         src = src.startsWith("/")
  //           ? `${BACKEND_BASE_URL}${src}`
  //           : `${BACKEND_BASE_URL}/${src}`;
  //       }
  //       return {
  //         type: "image",
  //         src: src,
  //         alt: el.getAttribute("alt") || "",
  //       };
  //     }

  //     // Fallback для других элементов
  //     return {
  //       type: "paragraph",
  //       text: el.textContent,
  //     };
  //   });
  // };

  // // Обрабатываем обложку статьи (используем hero_image для обложки страницы)
  // const getCoverImage = () => {
  //   // Приоритет: hero_image для обложки страницы, cover как fallback
  //   if (article.hero_image) {
  //     const imageField = article.hero_image;
  //     if (imageField.startsWith("http")) {
  //       return imageField;
  //     }
  //     if (imageField.startsWith("/media/")) {
  //       return `${BACKEND_BASE_URL}${imageField}`;
  //     }
  //     return `${BACKEND_BASE_URL}/media/${imageField}`;
  //   }
    
  //   if (article.cover) {
  //     const imageField = article.cover;
  //     if (imageField.startsWith("http")) {
  //       return imageField;
  //     }
  //     if (imageField.startsWith("/media/")) {
  //       return `${BACKEND_BASE_URL}${imageField}`;
  //     }
  //     return `${BACKEND_BASE_URL}/media/${imageField}`;
  //   }
    
  //   return null;
  // };

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
  const content = article.content

  return (
    <div>
      {/* Отображаем информацию о запросе к API */}
      {politikaLoading && (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#f0f0f0" }}>
          <p>Загружаем данные из API /api/blog/notarialni-blog/politika/...</p>
        </div>
      )}
      
      {politikaError && (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#ffe6e6" }}>
          <p style={{ color: "red" }}>Ошибка при загрузке данных: {politikaError}</p>
        </div>
      )}
      
      {politikaData && (
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#e6ffe6" }}>
          <p style={{ color: "green" }}>✅ Данные успешно загружены из API!</p>
          <pre style={{ fontSize: "12px", textAlign: "left", marginTop: "10px" }}>
            {JSON.stringify(politikaData, null, 2)}
          </pre>
        </div>
      )}

      <TemplateBlogPage
        title={article.title || "Без назви"}
        content={content}
        heroImage={article.hero_image}
        tags={tags}
        publishDate={formatDate(article.published_at)}
      />
    </div>
  );
};

export default BlogArticleDetailPage;
