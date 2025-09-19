// src/routes/AppRoutes.jsx
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import { lazy, Suspense } from "react";
import { NAV_TREE } from "../nav/nav-tree";
import { INDICES } from "../nav/indices"; // содержит pathById/idByPath/parentOf
import { useLang } from "../nav/use-lang";

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px'
  }}>
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
function collectRoutes(node, lang, pageProps, acc = []) {
  if (node.kind !== "group" && node.component) {
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
  const routes = collectRoutes(NAV_TREE, currentLang, pageProps);

  return (
    <Routes>
      {routes.map(({ id, path, Element }) => (
        <Route key={`${id}:${path}`} path={path} element={<Element />} />
      ))}

      {/* 404 */}
      <Route path="*" element={<div>404</div>} />
    </Routes>
  );
}
