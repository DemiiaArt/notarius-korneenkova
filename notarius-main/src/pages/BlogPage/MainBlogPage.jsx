import { useIsPC } from "@hooks/isPC";
import { useState } from "react";
import React from "react";
import "./MainBlogPage.scss";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import BlogCard from "@components/Blog/BlogCard";
import Loader from "@components/Loader/Loader";
import ArrowLeft from "../../assets/media/icons/arrov-blog-pagination-left.svg";
import ArrowRight from "../../assets/media/icons/arrov-blog-pagination-right.svg";
import { useBlog } from "@hooks/useBlog";
import { useTranslation } from "@hooks/useTranslation";

const MainBlogPage = ({ heroBlogImgClass = "heroBlogImgClass" }) => {
  const isPC = useIsPC();
  const { t } = useTranslation("components.pages.BlogPage");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Загружаем данные из API
  const { articles, categories, loading, error, totalPages, totalCount } =
    useBlog({
      page: currentPage,
      category: activeFilter,
    });

  // Формируем категории фильтров
  const filterCategories = [
    { id: "all", label: t("all Articles") || "Всі статті" },
    ...categories
      .filter((cat) => cat.show_in_filters !== false)
      .map((cat) => ({
        id: cat.slug,
        label: cat.name.toUpperCase(),
      })),
  ];

  // Формируем список карточек из данных API
  const blogCardsList = articles.map((article, index) => (
    <li
      className="blog-card-item"
      key={article.id || `blog-card-item-${index}`}
    >
      <BlogCard
        {...article}
        maxTextLength={isPC ? 120 : 96} // Адаптивная длина текста
      />
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
              <h1
                className={`fw-bold uppercase ${isPC ? "fs-p--40px" : "fs-p--24px"} c1`}
              >
                {t("title") || "Блог"}
              </h1>
              {!loading && totalCount > 0 && (
                <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"} c2 mt-2`}>
                  Знайдено {totalCount}{" "}
                  {totalCount === 1
                    ? "статтю"
                    : totalCount < 5
                      ? "статті"
                      : "статей"}
                </p>
              )}
            </div>
          </div>
          <div className="hero-img-shadow"></div>
        </div>
      </div>
      <div className="main-blog-page">
        <div className="container">
          {/* Показываем ошибку, если есть */}
          {error && (
            <div className="blog-error">
              <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"} c16`}>
                {error}
              </p>
            </div>
          )}

          {/* Показываем загрузчик */}
          {loading && (
            <div className="blog-loading">
              <Loader />
            </div>
          )}

          {/* Контент блога */}
          {!loading && (
            <>
              <div className="filterTag">
                {/* Desktop фильтры */}
                <div className="filterTag-desktop">
                  {filterCategories.map((category) => (
                    <button
                      key={category.id}
                      className={`filterTag-button ${activeFilter === category.id ? "active" : ""}`}
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
                    {filterCategories.find((cat) => cat.id === activeFilter)
                      ?.label || "Всі статті"}
                    <span
                      className={`filterTag-mobile-arrow ${isMobileFilterOpen ? "open" : ""}`}
                    ></span>
                  </button>

                  {isMobileFilterOpen && (
                    <div
                      className="filterTag-mobile-overlay"
                      onClick={() => setIsMobileFilterOpen(false)}
                    >
                      <div
                        className="filterTag-mobile-dropdown"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {filterCategories.map((category, index) => (
                          <button
                            key={category.id}
                            className={`filterTag-mobile-option ${activeFilter === category.id ? "active" : ""} ${index === 0 ? "first-option" : ""}`}
                            onClick={() => handleFilterChange(category.id)}
                          >
                            {category.label}
                            {index === 0 && (
                              <span className="filterTag-mobile-arrow-up"></span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ul className="blog-cards-list">{blogCardsList}</ul>

              {/* Сообщение если нет статей */}
              {!loading && articles.length === 0 && (
                <div className="blog-empty">
                  <p className={`${isPC ? "fs-p--18px" : "fs-p--16px"}`}>
                    {t("noArticles") || "Статті не знайдено"}
                  </p>
                </div>
              )}

              {/* Пагинация */}
              {!loading && totalPages > 1 && (
                <div className="pagination">
                  <div className="pagination-info">
                    <p className={`${isPC ? "fs-p--14px" : "fs-p--12px"} c2`}>
                      Сторінка {currentPage} з {totalPages}
                    </p>
                  </div>
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
                        {currentPage > 4 && (
                          <span className="pagination-dots">...</span>
                        )}
                      </>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
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
                            className={`pagination-page ${currentPage === page ? "active" : ""}`}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </button>
                        );
                      })}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && (
                          <span className="pagination-dots">...</span>
                        )}
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
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MainBlogPage;
