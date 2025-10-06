import { useIsPC } from "@hooks/isPC";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import "./NotaryServices.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

const NotaryServices = ({ title, listItems, heroImageUrl }) => {
  const isPC = useIsPC();
  const { open } = useModal();
  const backgroundStyle = heroImageUrl
    ? { backgroundImage: `url(http://localhost:8000${heroImageUrl})` }
    : undefined;

  return (
    <div className="services-page-shadow-target">
      <div className="services-page" style={backgroundStyle}>
        <div className="container">
          <div className="services-page-content">
            <Breadcrumbs />
            <h1
              className={`services-page-title ${
                isPC ? "fs-h1--40px" : "fs-h1--24px"
              } fw-bold lh-100 uppercase c8`}
            >
              {title}
            </h1>
            <ul
              className={`services-page-list ${
                isPC ? "fs-p--16px" : "fs-p--14px"
              } uppercase c1`}
            >
              {listItems?.map((item, index) => (
                <li key={index} className="services-page-list-item">
                  {item}
                </li>
              ))}
            </ul>
            <button
              onClick={() => open("freeOrder")}
              className={`services-page-btn btn-z-style ${
                isPC ? "fs-p--16px" : "fs-p--14px"
              } uppercase c1 bg4`}
            >
              Замовити консультацію
            </button>
          </div>
        </div>
      </div>
      <div className="services-page-shadow"></div>
    </div>
  );
};

export default NotaryServices;
