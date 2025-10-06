import { useIsPC } from "@hooks/isPC";
import { useState } from "react";
import React from "react";
import "./MainBlogPage.scss";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import BlogCard from "@components/Blog/BlogCard";
import BlogCard1 from "../../assets/media/BlogCard1.png";
import BlogCard2 from "../../assets/media/BlogCard2.png";
import BlogCard3 from "../../assets/media/BlogCard3.png";
import ArrowLeft from "../../assets/media/icons/arrov-blog-pagination-left.svg";
import ArrowRight from "../../assets/media/icons/arrov-blog-pagination-right.svg";
import TemplateBlogPage from "./TemplateBlogPage";
import { getArticleById } from "./blogData";


const MainBlogPage = ({ heroBlogImgClass = "heroBlogImgClass" }) => {
    const isPC = useIsPC();
    const [activeFilter, setActiveFilter] = useState('all');
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const cardsPerPage = 6;
    const filterCategories = [
        { id: 'all', label: 'Всі статті' },
        { id: 'bisnes', label: 'БІЗНЕС' },
        { id: 'family', label: 'Сімейні спори' },
        { id: 'military', label: 'Воєнний час' },
        { id: 'taxes', label: 'Податки' }
    ];

    // Получаем данные статьи для первой карточки
    const articleData = getArticleById("blog-article");
    
    const blogCards = [
        {
            title: articleData.title,
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "10.01.2024",
            image: articleData.heroImage,
            category: "bisnes",
            link: "/blog-article",
            tags: articleData.tags
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "08.01.2024",
            image: BlogCard2,
            category: "bisnes, taxes"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "05.01.2024",
            image: BlogCard3,
            category: "family"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "03.01.2024",
            image: BlogCard1,
            category: "military, family"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "01.01.2024",
            image: BlogCard2,
            category: "taxes"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "28.12.2023",
            image: BlogCard3,
            category: "taxes, family"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "28.12.2023",
            image: BlogCard3,
            category: "family"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "28.12.2023",
            image: BlogCard3,
            category: "bisnes"
        },
        {
            title: "Нотаріальне посвідчення підпису",
            text: "Підтвердження достовірності підпису на документі є найбільш популярною нотаріальною послугою серед фізичних осіб. Обличчя самостійно",
            date: "28.12.2023",
            image: BlogCard3,
            category: "taxes"
        },
    ];
    // Фильтрация карточек
    const filteredCards = activeFilter === 'all' 
        ? blogCards 
        : blogCards.filter(card => card.category.includes(activeFilter));

    // Пагинация
    const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
    const startIndex = (currentPage - 1) * cardsPerPage;
    const endIndex = startIndex + cardsPerPage;
    const currentCards = filteredCards.slice(startIndex, endIndex);

    const blogCardsList = currentCards.map((card, index) => (
        <li className="blog-card-item" key={`blog-card-item-${index}`}>
            <BlogCard {...card} />
        </li>
    ));

    const handleFilterChange = (filterId) => {
        setActiveFilter(filterId);
        setIsMobileFilterOpen(false);
        setCurrentPage(1); // Сброс на первую страницу при смене фильтра
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };
    return (
    <>
    <div className="hero">
      <div className="hero-img-shadow-target">
        <div className={`hero-img ${heroBlogImgClass || ""}`}>
          <div className="container hero-container">
            <Breadcrumbs />
            <h1 className={`fw-bold uppercase ${isPC ? "fs-p--40px" : "fs-p--24px"} c1`}>
              {"Блог"}
            </h1>
          </div>
        </div>
        <div className="hero-img-shadow"></div>
      </div>
        </div>  
        <div className="main-blog-page">
            <div className="container">
                <div className="filterTag">
                    {/* Desktop фильтры */}
                    <div className="filterTag-desktop">
                        {filterCategories.map(category => (
                            <button
                                key={category.id}
                                className={`filterTag-button ${activeFilter === category.id ? 'active' : ''}`}
                                onClick={() => handleFilterChange(category.id)}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile фильтр */}
                    <div className="filterTag-mobile">
                        <button 
                            className="filterTag-mobile-trigger"
                            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                        >
                            {filterCategories.find(cat => cat.id === activeFilter)?.label || 'Всі статті'}
                            <span className={`filterTag-mobile-arrow ${isMobileFilterOpen ? 'open' : ''}`}></span>
                        </button>
                        
                        {isMobileFilterOpen && (
                            <div className="filterTag-mobile-overlay" onClick={() => setIsMobileFilterOpen(false)}>
                                <div className="filterTag-mobile-dropdown" onClick={(e) => e.stopPropagation()}>
                                    {filterCategories.map((category, index) => (
                                        <button
                                            key={category.id}
                                            className={`filterTag-mobile-option ${activeFilter === category.id ? 'active' : ''} ${index === 0 ? 'first-option' : ''}`}
                                            onClick={() => handleFilterChange(category.id)}
                                        >
                                            {category.label}
                                            {index === 0 && <span className="filterTag-mobile-arrow-up"></span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <ul className="blog-cards-list">
                    {blogCardsList}
                </ul>
                
                {/* Пагинация */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button 
                            className="pagination-arrow pagination-arrow-left"
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            <img src={ArrowLeft} alt="Previous page" />
                        </button>
                        
                        <div className="pagination-pages">
                            {currentPage > 3 && (
                                <>
                                    <button 
                                        className="pagination-page"
                                        onClick={() => handlePageChange(1)}
                                    >
                                        1
                                    </button>
                                    {currentPage > 4 && <span className="pagination-dots">...</span>}
                                </>
                            )}
                            
                            {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter(page => 
                                    page === 1 || 
                                    page === totalPages || 
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                )
                                .map((page, index, array) => {
                                    if (index > 0 && page - array[index - 1] > 1) {
                                        return (
                                            <React.Fragment key={`dots-${page}`}>
                                                <span className="pagination-dots">...</span>
                                                <button 
                                                    className="pagination-page"
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </button>
                                            </React.Fragment>
                                        );
                                    }
                                    return (
                                        <button 
                                            key={page}
                                            className={`pagination-page ${currentPage === page ? 'active' : ''}`}
                                            onClick={() => handlePageChange(page)}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                            
                            {currentPage < totalPages - 2 && (
                                <>
                                    {currentPage < totalPages - 3 && <span className="pagination-dots">...</span>}
                                    <button 
                                        className="pagination-page"
                                        onClick={() => handlePageChange(totalPages)}
                                    >
                                        {totalPages}
                                    </button>
                                </>
                            )}
                        </div>
                        
                        <button 
                            className="pagination-arrow pagination-arrow-right"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            <img src={ArrowRight} alt="Next page" />
                        </button>
                    </div>
                )}
            </div>
        </div>

        </>
    )
}
    


export default MainBlogPage;

