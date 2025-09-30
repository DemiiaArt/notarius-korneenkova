import { useIsPC } from "@hooks/isPC";
import OptimizedImage from "@components/OptimizedImage/OptimizedImage";
import { Link } from "react-router-dom";
import "./BlogCard.scss";

const BlogCard = ({ 
    title, 
    text, 
    date, 
    image, 
    link = "#",
    onClick 
}) => {
    const isPC = useIsPC();

    const handleClick = (e) => {
        if (onClick) {
            onClick(e);
        }
    };

    const cardContent = (
        <>
            {image && <OptimizedImage src={image} alt={title || "Blog Card"} />}
            {title && <h2 className={`blog-card-title ${isPC ? "fs-p--28px" : "fs-p--24px"} fw-bold uppercase c3`}>{title}</h2>}
            {text && <p className={`blog-card-text ${isPC ? "fs-p--16px" : "fs-p--14px fw-regular"} lh-150 `}>{text}</p>}
            {date && <p className={`blog-card-date ${isPC ? "fs-p--20px" : "fs-p--16px"} fw-regular lh-150 `}>{date}</p>}
        </>
    );  

    return (
        <div 
            className="blog-card" 
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick(e);
                }
            }}
            aria-label={`Перейти к статье: ${title || "Blog Card"}`}
        >
            {link && link !== "#" ? (
                <Link to={link} className="blog-card-link">
                    {cardContent}
                </Link>
            ) : (
                cardContent
            )}
        </div>
    )
}

export default BlogCard;