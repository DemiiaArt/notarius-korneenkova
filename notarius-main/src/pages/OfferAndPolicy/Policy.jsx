import { useIsPC } from "@hooks/isPC";
import { useLanguage } from "@hooks/useLanguage";
import Breadcrumbs from "@components/BreadCrumbs/BreadCrumbs";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";
import "./OfferAndPolicy.scss";

const PolicyPage = () => {
  const isPC = useIsPC();
  const { currentLang } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";
    fetch(`${API_BASE_URL}/legal/privacy_policy/?lang=${lang}`, {
      headers: {
        Accept: "application/json",
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load privacy policy document");
        return r.json();
      })
      .then((data) => {
        console.log(data);
        setTitle(data?.title || "");
        setContent(data?.content || "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [currentLang]);
  return (
    <>
      <div className="container text-container">
        <Breadcrumbs />
        <h1
          className={`policy-title ${isPC ? "fs-h1--40px" : "fs-h1--24px"} fw-bold uppercase`}
        >
          {title || "Політика конфіденційності"}
        </h1>
        {loading ? (
          <div className="content">
            <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
              Завантаження...
            </p>
          </div>
        ) : error ? (
          <div className="content">
            <p className={`${isPC ? "fs-p--16px" : "fs-p--14px"}`}>
              Не вдалося завантажити документ.
            </p>
          </div>
        ) : (
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        )}
      </div>
    </>
  );
};

export default PolicyPage;
