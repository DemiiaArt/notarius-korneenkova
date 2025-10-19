import { useState, useEffect } from "react";
import { Helmet } from "@vuer-ai/react-helmet-async";
import { useLanguage } from "@hooks/useLanguage";
import { BACKEND_BASE_URL } from "@/config/api";

/**
 * Универсальный компонент для вставки JSON-LD структурированных данных
 * Загружает данные с API и автоматически вставляет их в <head>
 *
 * @param {Object} props
 * @param {string} props.apiUrl - URL для загрузки данных (например, "/api/about-me/detail/")
 * @param {boolean} [props.includeLang=true] - Добавлять ли параметр lang к URL
 * @param {Object} [props.params] - Дополнительные параметры запроса
 * @param {Array} [props.dependencies=[]] - Дополнительные зависимости для useEffect
 *
 * @example
 * // Простое использование
 * <JsonLdSchema apiUrl="/api/about-me/detail/" />
 *
 * @example
 * // С дополнительными параметрами
 * <JsonLdSchema
 *   apiUrl="/api/video-blocks/"
 *   params={{ type: "contacts" }}
 * />
 *
 * @example
 * // Для услуг с динамическим slug
 * <JsonLdSchema
 *   apiUrl={`/api/services/${slug1}/`}
 *   dependencies={[slug1]}
 * />
 */
const JsonLdSchema = ({
  apiUrl,
  includeLang = true,
  params = {},
  dependencies = [],
}) => {
  const { currentLang } = useLanguage();
  const [jsonLdData, setJsonLdData] = useState(null);

  useEffect(() => {
    // Определяем язык
    const lang = ["ua", "ru", "en"].includes(currentLang) ? currentLang : "ua";

    // Функция для загрузки JSON-LD данных
    const loadSchema = async () => {
      try {
        // Строим URL с параметрами
        const url = new URL(apiUrl, BACKEND_BASE_URL);

        // Добавляем язык, если нужно
        if (includeLang) {
          url.searchParams.append("lang", lang);
        }

        // Добавляем дополнительные параметры
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
        console.log(url.toString());
        const response = await fetch(url.toString(), {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          console.warn(
            `Failed to load JSON-LD schema from ${apiUrl}: ${response.status}`
          );
          setJsonLdData(null);
          return;
        }

        const data = await response.json();
        console.log(data);
        // Если есть json_ld, сохраняем данные
        if (data.json_ld) {
          // json_ld может приходить как строка или объект
          const jsonLdContent =
            typeof data.json_ld === "string"
              ? JSON.parse(data.json_ld)
              : data.json_ld;

          setJsonLdData(jsonLdContent);
          console.log(`✅ JSON-LD schema loaded from ${apiUrl}`);
        } else {
          setJsonLdData(null);
        }
      } catch (error) {
        console.error(`Error loading JSON-LD schema from ${apiUrl}:`, error);
        setJsonLdData(null);
      }
    };

    loadSchema();
  }, [
    apiUrl,
    currentLang,
    includeLang,
    JSON.stringify(params),
    ...dependencies,
  ]);

  // Если нет данных, ничего не рендерим
  if (!jsonLdData) {
    return null;
  }

  // Вставляем JSON-LD в head через Helmet
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(jsonLdData)}</script>
    </Helmet>
  );
};

export default JsonLdSchema;
