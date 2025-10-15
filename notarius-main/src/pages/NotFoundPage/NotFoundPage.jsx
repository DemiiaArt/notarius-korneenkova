import "./NotFoundPage.scss";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const isPC = useIsPC();
  const { t } = useTranslation("components.pages.NotFoundPage");
  
  return (
    <div className="not-found-page">
      <div className="content">
        <h2 className={`${isPC ? "fs-h1--70px" : "fs-p--24px"} c4 uppercase`}>
          {t("error")}{" "}
        </h2>
        <h2
          className={`${isPC ? "fs-h1--70px" : "fs-p--24px"} c4 uppercase not-found-h`}
        >
          {t("notFound")}{" "}
        </h2>
        <p className={`${isPC ? "fs-p--36px" : "fs-p--18px"} c3 `}>
          {" "}
          {t("notAllLost")}{" "}
        </p>
        <p className={`${isPC ? "fs-p--36px" : "fs-p--18px"} c3 `}>
          {t("returnTo")}{" "}
          <Link className="mainLink" to="/">
            {t("homePage")}
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
