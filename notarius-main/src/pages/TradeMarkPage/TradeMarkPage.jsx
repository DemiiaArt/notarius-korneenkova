import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import PdfFrame from "./PdfFrame";
import "./TradeMarkPage.scss";
import { useLanguage } from "@hooks/useLanguage";
import { useEffect, useState } from "react";
import { API_BASE_URL, MEDIA_BASE_URL } from "@/config/api";
import pdfSrc from "@media/TradeMark.pdf";

const TradeMarkPage = () => {
  const { currentLang } = useLanguage();
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";
    setLoading(true);
    setError(null);
    fetch(`${API_BASE_URL}/legal/trademark/?lang=${lang}`, {
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((resp) => {
        setData(resp);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Failed to load");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentLang]);

  const pdfUrl = (() => {
    if (data && data.file) {
      const url = String(data.file);
      if (url.startsWith("http://") || url.startsWith("https://")) return url;
      if (url.startsWith("/media"))
        return `${MEDIA_BASE_URL}${url.replace("/media", "")}`;
      if (url.startsWith("/")) return `${API_BASE_URL}${url}`;
      return `${API_BASE_URL}/${url}`;
    }
    return pdfSrc; // fallback на статический файл
  })();

  return (
    <div className="trade-mark">
      <div className="container">
        <Breadcrumbs />
        <h1 className="trade-mark-title fs-h1--40px fw-bold lh-100 uppercase">
          {data.title}
        </h1>
        <PdfFrame src={pdfUrl} />
      </div>
    </div>
  );
};

export default TradeMarkPage;
