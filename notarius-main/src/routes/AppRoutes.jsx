// src/routes/AppRoutes.jsx
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { INDICES } from "../nav/indices"; // содержит pathById/idByPath/parentOf
import { useLang } from "../nav/use-lang";
import { useHybridNav } from "../contexts/HybridNavContext";
import DynamicRenderer from "../components/DynamicRenderer/DynamicRenderer";
import { getComponentById, hasComponent } from "../nav/component-registry";
import DynamicChildrenLoader from "../components/DynamicChildrenLoader/DynamicChildrenLoader";
import BlogArticlePage from "../pages/BlogPage/BlogArticlePage";
import BlogArticleDetailPage from "../pages/BlogPage/BlogArticleDetailPage";
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

    // Берём компонент строго из реестра по id, игнорируя любые поля component в дереве
    const Comp = getComponentById(node.id);
    const isValidComponent =
      !!Comp &&
      (typeof Comp === "function" ||
        (typeof Comp === "object" && "$$typeof" in Comp));

    if (isValidComponent) {
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <Comp {...pageProps} {...nodeProps} {...dynamic} />
        </Suspense>
      );
    }

    // Иначе ничего не рендерим здесь — дадим шанс динамическим маршрутам ниже
    return null;
  };
}

/** Рекурсивно собираем все роуты для текущего языка */
function collectRoutes(node, lang, pageProps, acc = []) {
  if (hasComponent(node.id)) {
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
  const { navTree } = useHybridNav();

  const routes = collectRoutes(navTree, currentLang, pageProps);
  const hasRoot = routes.some(({ path }) => path === "/");
  const HomeComp = getComponentById ? getComponentById("home") : null;

  return (
    <Routes>
      {routes.map(({ id, path, Element }) => (
        <Route key={`${id}:${path}`} path={path} element={<Element />} />
      ))}

      {/* Явный маршрут на корень для ua, если по каким-то причинам не собрался */}
      {!hasRoot && HomeComp && (
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <HomeComp />
            </Suspense>
          }
        />
      )}

      {/* Blog article routes */}
      {/* Ukrainian (no prefix) */}
      <Route
        path="/notarialni-blog/:slug"
        element={<BlogArticleDetailPage />}
      />
      {/* Russian */}
      <Route
        path="/ru/notarialni-blog/:slug"
        element={<BlogArticleDetailPage />}
      />
      {/* English */}
      <Route path="/en/notary-blog/:slug" element={<BlogArticleDetailPage />} />

      {/* Dynamic routes for 3rd and 4th level pages */}
      {/* Ukrainian (no prefix) */}
      <Route path="/:slug1/:slug2/:slug3" element={<DynamicPageRenderer />} />
      <Route path="/:slug1/:slug2" element={<DynamicPageRenderer />} />

      {/* Russian */}
      <Route
        path="/ru/:slug1/:slug2/:slug3"
        element={<DynamicPageRenderer />}
      />
      <Route path="/ru/:slug1/:slug2" element={<DynamicPageRenderer />} />

      {/* English */}
      <Route
        path="/en/:slug1/:slug2/:slug3"
        element={<DynamicPageRenderer />}
      />
      <Route path="/en/:slug1/:slug2" element={<DynamicPageRenderer />} />

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
