import BlogArticleDetailPage from "./BlogArticleDetailPage";

/**
 * Универсальный компонент для всех статей блога
 * Использует BlogArticleDetailPage для загрузки данных из API
 * Работает для всех статей из backend (article-1, article-2, etc.)
 */
const BlogArticlePage = () => {
  return <BlogArticleDetailPage />;
};

export default BlogArticlePage;
