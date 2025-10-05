import TemplateBlogPage from "./TemplateBlogPage";
import { getArticleById } from "./blogData";
import { useBlogArticle } from "@hooks/useBlog";
import { useParams } from "react-router-dom";

const BlogArticlePage = () => {
    // Получаем slug из URL
    const { slug } = useParams();
    
    // Загружаем статью из API
    const { article, loading, error } = useBlogArticle(slug);
    
    // Fallback данные если API не загрузился
    const fallbackData = getArticleById("blog-article");
    
    // Используем данные из API или fallback
    const articleData = article || fallbackData;

    if (loading) {
        return <div>Завантаження статті...</div>;
    }

    if (error && !fallbackData) {
        return <div>Помилка при завантаженні статті: {error}</div>;
    }

    return (
        <TemplateBlogPage 
            title={articleData.title}
            content={articleData.content}
            heroImgClass={articleData.heroImgClass}
            heroImage={articleData.heroImage}
            tags={articleData.tags}
            publishDate={articleData.publishDate || articleData.created_at}
        />
    );
};

export default BlogArticlePage;
