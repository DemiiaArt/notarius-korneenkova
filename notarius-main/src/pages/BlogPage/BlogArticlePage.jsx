import TemplateBlogPage from "./TemplateBlogPage";
import { getArticleById } from "./blogData";

const BlogArticlePage = () => {
    // Получаем данные статьи по ID (в данном случае "blog-article")
    const articleData = getArticleById("blog-article");

    return (
        <TemplateBlogPage 
            title={articleData.title}
            content={articleData.content}
            heroImgClass={articleData.heroImgClass}
            heroImage={articleData.heroImage}
            tags={articleData.tags}
            publishDate={articleData.publishDate}
        />
    );
};

export default BlogArticlePage;
