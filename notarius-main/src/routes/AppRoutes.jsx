// src/routes/AppRoutes.jsx
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { INDICES } from "../nav/indices"; // содержит pathById/idByPath/parentOf
import { useLang } from "../nav/use-lang";
import { useHybridNav } from "../contexts/HybridNavContext";
import DynamicRenderer from "../components/DynamicRenderer/DynamicRenderer";
import DynamicChildrenLoader from "../components/DynamicChildrenLoader/DynamicChildrenLoader";
import BlogArticlePage from "../pages/BlogPage/BlogArticlePage";
import DynamicPageRenderer from "../components/DynamicPages/DynamicPageRenderer";

// Loading component
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      fontSize: "18px",
    }}
  >
    Завантаження...
  </div>
);

/** Убираем завершающий слеш, но оставляем "/" для корня */
const normalizeForRoute = (p) => {
  if (!p) return p;
  const noTrailing = p.replace(/\/+$/, "");
  return noTrailing === "" ? "/" : noTrailing;
};

/** Создание элемента маршрута с динамическим рендерингом */
function makeRouteElement(node, pageProps) {
  const nodeProps = node.componentProps || {};
  const getProps = node.getProps;

  return function RouteElement() {
    const { currentLang } = useLang();
    const params = useParams();
    const location = useLocation();

    const dynamic = getProps
      ? getProps({ lang: currentLang, params, location, node })
      : {};

    // Если есть компонент в узле, используем его
    if (node.component) {
      const Comp = node.component;
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <Comp {...pageProps} {...nodeProps} {...dynamic} />
        </Suspense>
      );
    }

    // Иначе используем динамический рендерер по ID
    return (
      <DynamicRenderer
        id={node.id}
        componentProps={{ ...pageProps, ...nodeProps, ...dynamic }}
      />
    );
  };
}

/** Рекурсивно собираем все роуты для текущего языка */
function collectRoutes(node, lang, pageProps, acc = []) {
  if (node.component) {
    const rawPath = INDICES.pathById[lang]?.[node.id];
    const path = normalizeForRoute(rawPath);
    if (path) {
      const Element = makeRouteElement(node, pageProps);
      acc.push({ id: node.id, path, Element });
    }
  }
  node.children?.forEach((ch) => collectRoutes(ch, lang, pageProps, acc));
  return acc;
}

export default function AppRoutes({ pageProps = {} }) {
  const { currentLang } = useLang();
  const { navTree, loading, error } = useHybridNav();

  // Показываем загрузку
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Завантаження навігації...
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Помилка завантаження навігації</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  // Если нет навигационного дерева
  if (!navTree) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Навігація не знайдена
      </div>
    );
  }

  const routes = collectRoutes(navTree, currentLang, pageProps);

  return (
    <Routes>
      {routes.map(({ id, path, Element }) => (
        <Route key={`${id}:${path}`} path={path} element={<Element />} />
      ))}

      {/* Dynamic routes for 3rd and 4th level pages */}
      <Route path="/:slug1/:slug2/:slug3" element={<DynamicPageRenderer />} />
      <Route path="/:slug1/:slug2" element={<DynamicPageRenderer />} />

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
