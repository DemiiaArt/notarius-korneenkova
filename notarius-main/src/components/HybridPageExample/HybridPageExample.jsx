import React from "react";
import { useParams } from "react-router-dom";
import { useHybridNav } from "../../contexts/HybridNavContext";
import DynamicChildrenLoader from "../DynamicChildrenLoader/DynamicChildrenLoader";
import { findNodeById, getLabel } from "../../nav/nav-utils";
import { useLang } from "../../nav/use-lang";

/**
 * Пример компонента страницы, работающей с гибридной системой навигации
 * Показывает статический контент + динамически загружаемые подразделы
 */
const HybridPageExample = () => {
  const { id } = useParams();
  const { navTree } = useHybridNav();
  const { currentLang } = useLang();

  // Получаем данные текущего узла из статического дерева
  const currentNode = findNodeById(navTree, id);

  if (!currentNode) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Страница не найдена</h2>
        <p>Узел с ID "{id}" не найден в навигационном дереве.</p>
      </div>
    );
  }

  const title = getLabel(currentNode, currentLang);
  const slug = currentNode.slug?.[currentLang] || "";

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Статический контент страницы */}
      <header style={{ marginBottom: "30px" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: "10px", color: "#333" }}>
          {title}
        </h1>
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          ID: {id} | Slug: {slug} | Тип: {currentNode.kind}
        </p>
      </header>

      {/* Статический контент */}
      <section style={{ marginBottom: "40px" }}>
        <h2>Статический контент</h2>
        <p>
          Этот контент загружается из статического nav-tree.js файла. Он
          доступен сразу при загрузке страницы.
        </p>
        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "20px",
            borderRadius: "8px",
            border: "1px solid #dee2e6",
          }}
        >
          <h3>Информация об узле:</h3>
          <ul>
            <li>
              <strong>ID:</strong> {currentNode.id}
            </li>
            <li>
              <strong>Тип:</strong> {currentNode.kind}
            </li>
            <li>
              <strong>Показывать в меню:</strong>{" "}
              {currentNode.showInMenu ? "Да" : "Нет"}
            </li>
            <li>
              <strong>Компонент:</strong>{" "}
              {currentNode.component ? "Есть" : "Нет"}
            </li>
          </ul>
        </div>
      </section>

      {/* Динамически загружаемые подразделы */}
      <section>
        <h2>Подразделы (загружаются с backend)</h2>
        <p>
          Эти подразделы загружаются динамически с backend API по ID
          родительского узла.
        </p>

        <DynamicChildrenLoader
          parentId={id}
          childrenRenderer={({ parentId }) => (
            <div
              style={{
                backgroundColor: "#e8f5e8",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #c3e6c3",
              }}
            >
              <h3>Дети узла "{parentId}" успешно загружены!</h3>
              <p>
                Здесь можно отобразить список подразделов или другую
                динамическую информацию.
              </p>
              <p>
                <em>
                  В реальном приложении здесь будет компонент, который рендерит
                  список детей.
                </em>
              </p>
            </div>
          )}
          emptyComponent={({ parentId }) => (
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "20px",
                borderRadius: "8px",
                border: "1px solid #ffeaa7",
              }}
            >
              <h3>Подразделы не найдены</h3>
              <p>Для узла "{parentId}" нет доступных подразделов на backend.</p>
            </div>
          )}
        />
      </section>

      {/* Дополнительная информация */}
      <section
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        <h3>Как это работает:</h3>
        <ol>
          <li>
            <strong>Статическая часть:</strong> Данные узла (title, slug, kind)
            загружаются из nav-tree.js
          </li>
          <li>
            <strong>Динамическая часть:</strong> Дети узла загружаются с backend
            API по запросу
          </li>
          <li>
            <strong>Кеширование:</strong> Загруженные дети кешируются в
            localStorage на 5 минут
          </li>
          <li>
            <strong>Обработка ошибок:</strong> При ошибке API используются
            данные из кеша (если есть)
          </li>
        </ol>
      </section>
    </div>
  );
};

export default HybridPageExample;
