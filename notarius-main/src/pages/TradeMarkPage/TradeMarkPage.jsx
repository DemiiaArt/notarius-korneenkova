import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import PdfFrame from "./PdfFrame";
import "./TradeMarkPage.scss";
import { useLanguage } from "@hooks/useLanguage";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import pdfSrc from "@media/TradeMark.pdf";

const TradeMarkPage = () => {
  const { currentLang } = useLanguage();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";
    fetch(`${API_BASE_URL}/legal/trademark/?lang=${lang}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => r.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, [currentLang]);

  return (
    <div className="trade-mark">
      <div className="container">
        <Breadcrumbs />
        <h1 className="trade-mark-title fs-h1--40px fw-bold lh-100 uppercase">
          {data.title}
        </h1>
        <PdfFrame src={pdfSrc} />
      </div>
    </div>
  );
};

export default TradeMarkPage;
