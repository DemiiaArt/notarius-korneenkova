import "./NotFoundPage.scss";
import { useIsPC } from "@hooks/isPC";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const isPC = useIsPC();
  return (
    <div className="not-found-page">
      <div className="content">
        <h2 className={`${isPC ? "fs-h1--70px" : "fs-p--24px"} c4 uppercase`}>
          Помилка{" "}
        </h2>
        <h2
          className={`${isPC ? "fs-h1--70px" : "fs-p--24px"} c4 uppercase not-found-h`}
        >
          404{" "}
        </h2>
        <p className={`${isPC ? "fs-p--36px" : "fs-p--18px"} c3 `}>
          {" "}
          Але не все втрачено!{" "}
        </p>
        <p className={`${isPC ? "fs-p--36px" : "fs-p--18px"} c3 `}>
          Повернімося на{" "}
          <Link className="mainLink" to="/">
            головну
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
