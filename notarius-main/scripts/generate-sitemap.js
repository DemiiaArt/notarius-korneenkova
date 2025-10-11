/**
 * Скрипт для генерации sitemap.xml
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Базовый URL сайта
const SITE_URL = "https://notarius-nadiia.com";

// Все маршруты сайта
const routes = [
  // Украинский (основной)
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/notarialni-pro-mene", priority: "0.9", changefreq: "weekly" },
  { url: "/notarialni-poslugy", priority: "0.9", changefreq: "weekly" },
  { url: "/notarialni-pereklad", priority: "0.8", changefreq: "weekly" },
  {
    url: "/notarialni-dopomoga-viyskovim",
    priority: "0.8",
    changefreq: "weekly",
  },
  { url: "/notarialni-inshi", priority: "0.8", changefreq: "weekly" },
  { url: "/notarialni-contacty", priority: "0.9", changefreq: "monthly" },
  { url: "/notarialni-blog", priority: "0.9", changefreq: "daily" },
  { url: "/notarialni-offer", priority: "0.5", changefreq: "yearly" },
  { url: "/notarialni-policy", priority: "0.5", changefreq: "yearly" },
  {
    url: "/notarialni-torgivelna-marka",
    priority: "0.5",
    changefreq: "yearly",
  },

  // Русский язык
  { url: "/ru", priority: "0.9", changefreq: "daily" },
  { url: "/ru/notarialni-pro-mene", priority: "0.8", changefreq: "weekly" },
  { url: "/ru/notarialni-poslugy", priority: "0.8", changefreq: "weekly" },
  { url: "/ru/notarialni-pereklad", priority: "0.7", changefreq: "weekly" },
  {
    url: "/ru/notarialni-pomosch-voennym",
    priority: "0.7",
    changefreq: "weekly",
  },
  { url: "/ru/notarialni-inshi", priority: "0.7", changefreq: "weekly" },
  { url: "/ru/notarialni-contacty", priority: "0.8", changefreq: "monthly" },
  { url: "/ru/notarialni-blog", priority: "0.8", changefreq: "daily" },
  { url: "/ru/notarialni-offer", priority: "0.4", changefreq: "yearly" },
  { url: "/ru/notarialni-policy", priority: "0.4", changefreq: "yearly" },
  {
    url: "/ru/notarialni-torgova-marka",
    priority: "0.4",
    changefreq: "yearly",
  },

  // Английский язык
  { url: "/en", priority: "0.8", changefreq: "daily" },
  { url: "/en/notary-about", priority: "0.7", changefreq: "weekly" },
  { url: "/en/notary-services", priority: "0.7", changefreq: "weekly" },
  { url: "/en/notary-translate", priority: "0.6", changefreq: "weekly" },
  { url: "/en/notary-military-help", priority: "0.6", changefreq: "weekly" },
  { url: "/en/notary-other", priority: "0.6", changefreq: "weekly" },
  { url: "/en/notary-contacts", priority: "0.7", changefreq: "monthly" },
  { url: "/en/notary-blog", priority: "0.7", changefreq: "daily" },
  { url: "/en/notary-offer", priority: "0.3", changefreq: "yearly" },
  { url: "/en/notary-policy", priority: "0.3", changefreq: "yearly" },
  { url: "/en/notary-trade-mark", priority: "0.3", changefreq: "yearly" },
];

// Функция для генерации XML
function generateSitemapXML() {
  const currentDate = new Date().toISOString().split("T")[0];

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml +=
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

  routes.forEach((route) => {
    xml += "  <url>\n";
    xml += `    <loc>${SITE_URL}${route.url}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
    xml += `    <priority>${route.priority}</priority>\n`;

    // Добавляем hreflang для всех языковых версий
    const isRoot = route.url === "/";
    const isRu = route.url.startsWith("/ru");
    const isEn = route.url.startsWith("/en");

    if (isRoot || (!isRu && !isEn)) {
      // Украинская версия (основная)
      xml += `    <xhtml:link rel="alternate" hreflang="uk" href="${SITE_URL}${route.url}" />\n`;

      // Находим соответствующие русскую и английскую версии
      const ruUrl = findTranslatedUrl(route.url, "ru");
      const enUrl = findTranslatedUrl(route.url, "en");

      if (ruUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="ru" href="${SITE_URL}${ruUrl}" />\n`;
      }
      if (enUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enUrl}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${route.url}" />\n`;
    } else if (isRu) {
      // Русская версия
      const uaUrl = findTranslatedUrl(route.url, "ua");
      const enUrl = findTranslatedUrl(route.url, "en");

      if (uaUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="uk" href="${SITE_URL}${uaUrl}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="ru" href="${SITE_URL}${route.url}" />\n`;
      if (enUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${enUrl}" />\n`;
      }
      if (uaUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${uaUrl}" />\n`;
      }
    } else if (isEn) {
      // Английская версия
      const uaUrl = findTranslatedUrl(route.url, "ua");
      const ruUrl = findTranslatedUrl(route.url, "ru");

      if (uaUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="uk" href="${SITE_URL}${uaUrl}" />\n`;
      }
      if (ruUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="ru" href="${SITE_URL}${ruUrl}" />\n`;
      }
      xml += `    <xhtml:link rel="alternate" hreflang="en" href="${SITE_URL}${route.url}" />\n`;
      if (uaUrl) {
        xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}${uaUrl}" />\n`;
      }
    }

    xml += "  </url>\n";
  });

  xml += "</urlset>";
  return xml;
}

// Функция для поиска переведенного URL
function findTranslatedUrl(url, targetLang) {
  // Карта соответствий путей между языками
  const urlMap = {
    "/": { ua: "/", ru: "/ru", en: "/en" },
    "/notarialni-pro-mene": {
      ua: "/notarialni-pro-mene",
      ru: "/ru/notarialni-pro-mene",
      en: "/en/notary-about",
    },
    "/notarialni-poslugy": {
      ua: "/notarialni-poslugy",
      ru: "/ru/notarialni-poslugy",
      en: "/en/notary-services",
    },
    "/notarialni-pereklad": {
      ua: "/notarialni-pereklad",
      ru: "/ru/notarialni-pereklad",
      en: "/en/notary-translate",
    },
    "/notarialni-dopomoga-viyskovim": {
      ua: "/notarialni-dopomoga-viyskovim",
      ru: "/ru/notarialni-pomosch-voennym",
      en: "/en/notary-military-help",
    },
    "/notarialni-inshi": {
      ua: "/notarialni-inshi",
      ru: "/ru/notarialni-inshi",
      en: "/en/notary-other",
    },
    "/notarialni-contacty": {
      ua: "/notarialni-contacty",
      ru: "/ru/notarialni-contacty",
      en: "/en/notary-contacts",
    },
    "/notarialni-blog": {
      ua: "/notarialni-blog",
      ru: "/ru/notarialni-blog",
      en: "/en/notary-blog",
    },
    "/notarialni-offer": {
      ua: "/notarialni-offer",
      ru: "/ru/notarialni-offer",
      en: "/en/notary-offer",
    },
    "/notarialni-policy": {
      ua: "/notarialni-policy",
      ru: "/ru/notarialni-policy",
      en: "/en/notary-policy",
    },
    "/notarialni-torgivelna-marka": {
      ua: "/notarialni-torgivelna-marka",
      ru: "/ru/notarialni-torgova-marka",
      en: "/en/notary-trade-mark",
    },
  };

  // Находим ключ для текущего URL
  for (const [key, translations] of Object.entries(urlMap)) {
    if (Object.values(translations).includes(url)) {
      return translations[targetLang];
    }
  }

  return null;
}

// Генерируем и сохраняем sitemap
const sitemap = generateSitemapXML();
const outputPath = path.join(__dirname, "../dist/sitemap.xml");

// Создаем директорию dist если её нет
const distDir = path.join(__dirname, "../dist");
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(outputPath, sitemap);
console.log(`\n✅ Sitemap успешно сгенерирован: ${outputPath}\n`);
console.log(`📊 Содержит ${routes.length} URL\n`);
