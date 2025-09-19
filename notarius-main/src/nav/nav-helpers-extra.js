// Язык из pathname: "/", "/ru", "/en"
export function detectLocaleFromPath(pathname) {
  if (pathname.startsWith("/ru")) return "ru";
  if (pathname.startsWith("/en")) return "en";
  return "ua";
}

// Подпись узла по языку
export function getLabel(node, lang) {
  return (node?.label && node.label[lang]) || "";
}
