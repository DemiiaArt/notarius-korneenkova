// src/routes/AppRoutes.jsx
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import "../nav/attach-components"; // ❗ ВАЖНО: импортируем ПЕРВЫМ, чтобы компоненты назначились
import { NAV_TREE } from "../nav/nav-tree";
import { INDICES } from "../nav/indices"; // содержит pathById/idByPath/parentOf
import { useLang } from "../nav/use-lang";
import BlogArticlePage from "../pages/BlogPage/BlogArticlePage";

// Lazy load для динамических страниц категорий
const DynamicServiceCategoryPage = lazy(() => import("../pages/DynamicServiceCategoryPage/DynamicServiceCategoryPage"));

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

/** Твой «окончательный» makeRouteElement с динамическими пропсами */
function makeRouteElement(node, pageProps) {
  const Comp = node.component;
  const nodeProps = node.componentProps || {};
  const getProps = node.getProps;

  // Защита от пустых компонентов
  if (!Comp) {
    console.warn(`No component found for node: ${node.id}`, node);
    return function RouteElement() {
      return <div>Page not configured: {node.id}</div>;
    };
  }

  // Детальная проверка типа компонента
  const compType = typeof Comp;
  const isLazy = Comp?.$$typeof === Symbol.for('react.lazy');
  const isValid = compType === 'function' || isLazy;
  
  if (!isValid) {
    console.error(`❌ INVALID COMPONENT for ${node.id}:`, {
      nodeId: node.id,
      compType,
      isLazy,
      hasSymbol: Comp?.$$typeof,
      component: Comp,
      node
    });
  }

  return function RouteElement() {
    const { currentLang } = useLang();
    const params = useParams();
    const location = useLocation();

    const dynamic = getProps
      ? getProps({ lang: currentLang, params, location, node })
      : {};

    return (
      <Suspense fallback={<LoadingSpinner />}>
        <Comp {...pageProps} {...nodeProps} {...dynamic} />
      </Suspense>
    );
  };
}

/** Рекурсивно собираем все роуты для текущего языка */
function collectRoutes(node, lang, pageProps, indices, acc = []) {
  if (node.component) {
    const rawPath = indices.pathById[lang]?.[node.id];
    const path = normalizeForRoute(rawPath);
    if (path) {
      const Element = makeRouteElement(node, pageProps);
      acc.push({ id: node.id, path, Element });
    }
  }
  node.children?.forEach((ch) => collectRoutes(ch, lang, pageProps, indices, acc));
  return acc;
}

export default function AppRoutes({ pageProps = {} }) {
  const { currentLang } = useLang();
  
  // Используем статичные данные
  const routes = collectRoutes(NAV_TREE, currentLang, pageProps, INDICES);

  return (
    <Routes>
      {/* Сначала статичные роуты из navTree (имеют приоритет) */}
      {routes.map(({ id, path, Element }) => (
        <Route key={`${id}:${path}`} path={path} element={<Element />} />
      ))}

      {/* Blog article route */}
      <Route path="/blog-article" element={<BlogArticlePage />} />

      {/* Динамические роуты ПОСЛЕ статичных (только для неизвестных путей) */}
      {/* Эти роуты сработают только если путь не совпал ни с одним из статичных */}
      <Route path="/:slug1/:slug2/:slug3" element={
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicServiceCategoryPage />
        </Suspense>
      } />
      <Route path="/:slug1/:slug2" element={
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicServiceCategoryPage />
        </Suspense>
      } />
      <Route path="/:slug1" element={
        <Suspense fallback={<LoadingSpinner />}>
          <DynamicServiceCategoryPage />
        </Suspense>
      } />

      {/* 404 - самый последний */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
