import { useEffect } from "react";
import { useBreadcrumbSchema } from "@hooks/useBreadcrumbSchema";

/**
 * Компонент для вставки JSON-LD структурированных данных хлебных крошек
 * Автоматически обновляется при переключении страниц
 */
const BreadcrumbSchema = () => {
  const breadcrumbSchema = useBreadcrumbSchema();

  useEffect(() => {
    // ID для скрипта, чтобы можно было его найти и обновить
    const scriptId = "breadcrumb-schema";

    // Удаляем предыдущий скрипт если он есть
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    // Если схема готова, добавляем новый скрипт
    if (breadcrumbSchema) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/ld+json";
      script.textContent = breadcrumbSchema;

      // Вставляем в конец body
      document.body.appendChild(script);
    }

    // Cleanup: удаляем скрипт при размонтировании компонента
    return () => {
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [breadcrumbSchema]);

  // Компонент ничего не рендерит в DOM
  return null;
};

export default BreadcrumbSchema;
