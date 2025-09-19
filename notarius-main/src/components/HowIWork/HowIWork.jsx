import { useIsPC } from "@hooks/isPC";
import "./HowIWork.scss";

const HowIWork = () => {
  const isPC = useIsPC(1200);

  return (
    <div className="how-i-work">
      <div className="how-i-work-bg">
        <div className="container">
          <h2
            className={`how-i-work-title uppercase fw-bold ${isPC ? "fs-h2--32px" : "fs-p--20px"} c1`}
          >
            Як я працюю
          </h2>
          <div className="how-i-work-block bg4">
            <article className="how-i-work-block-item">
              <p
                className={`how-i-work-block-item-number fs-italic fw-bold ${isPC ? "fs-h1--40px " : "fs-p--20px"} c8 lh-100`}
              >
                01
              </p>
              <p
                className={`how-i-work-block-item-text fw-normal ${isPC ? "fs-p--18px lh-150" : "fs-p--14px lh-100"}  c8`}
              >
                Ви залишаєте заявку або телефонуєте
              </p>
            </article>
            <article className="how-i-work-block-item">
              <p
                className={`how-i-work-block-item-number fs-italic fw-bold ${isPC ? "fs-h1--40px" : "fs-p--20px"} c8 lh-100`}
              >
                02
              </p>
              <p
                className={`how-i-work-block-item-text fw-normal ${isPC ? "fs-p--18px lh-150" : "fs-p--14px lh-100"}  c8`}
              >
                Безкоштовна консультація та перевірка документів
              </p>
            </article>
            <article className="how-i-work-block-item">
              <p
                className={`how-i-work-block-item-number fs-italic fw-bold ${isPC ? "fs-h1--40px" : "fs-p--20px"} c8 lh-100`}
              >
                03
              </p>
              <p
                className={`how-i-work-block-item-text fw-normal ${isPC ? "fs-p--18px lh-150" : "fs-p--14px lh-100"}  c8`}
              >
                Підготовка та оформлення необхідних паперів
              </p>
            </article>
            <article className="how-i-work-block-item">
              <p
                className={`how-i-work-block-item-number fs-italic fw-bold ${isPC ? "fs-h1--40px" : "fs-p--20px"} c8 lh-100`}
              >
                04
              </p>
              <p
                className={`how-i-work-block-item-text fw-normal ${isPC ? "fs-p--18px lh-150" : "fs-p--14px lh-100"}  c8`}
              >
                Засвідчення документів і передача їх клієнту
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowIWork;
