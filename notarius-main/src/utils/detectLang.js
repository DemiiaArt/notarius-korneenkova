export const detectLang = (pathname) =>
  pathname.match(/^\/(en|ru)(?=\/|$)/)?.[1] ?? "ua";

export const buildLocalizedLink = (links, lang) => {
  if (!links) return "/";
  let raw = links[lang] ?? links.ua ?? "";

  if (!raw) return "/";

  // Если уже абсолютный путь — возвращаем как есть
  if (raw.startsWith("/")) return raw;

  // Добавляем языковой префикс только если не "ua"
  const prefix = lang === "ua" ? "" : `/${lang}`;
  return `${prefix}/${raw}`.replace(/\/{2,}/g, "/");
};
