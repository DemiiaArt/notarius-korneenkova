import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import PdfFrame from "./PdfFrame";
import "./TradeMarkPage.scss";
import pdf from "@media/TradeMark.pdf";

const TradeMarkPage = () => {
  return (
    <div className="trade-mark">
      <div className="container">
        <Breadcrumbs />
        <h1 className="trade-mark-title fs-h1--40px fw-bold lh-100 uppercase">
          Торгова марка
        </h1>
        <PdfFrame src={pdf} />
      </div>
    </div>
  );
};

export default TradeMarkPage;
