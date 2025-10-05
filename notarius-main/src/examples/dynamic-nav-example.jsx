// src/examples/dynamic-nav-example.jsx
// Пример использования динамической системы навигации

import React, { useState } from "react";
import { useNavTree } from "@nav/use-nav-tree";
import {
  getComponentById,
  hasComponent,
  getAllComponentIds,
} from "@nav/component-registry";
import Loader from "@components/Loader/Loader";

const DynamicNavExample = () => {
  const { tree, isLoading, error, refreshTree } = useNavTree();
  const [selectedId, setSelectedId] = useState("");

  if (isLoading) {
    return (
      <Loader
        message="Завантаження навігації з backend..."
        variant="spinner"
        size="large"
      />
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2 style={{ color: "red" }}>Помилка завантаження</h2>
        <p>{error}</p>
        <button
          onClick={refreshTree}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  if (!tree) {
    return <Loader message="Ініціалізація..." variant="dots" size="medium" />;
  }

  // Рекурсивная функция для получения всех элементов дерева
  const getAllItems = (node, level = 0) => {
    const items = [];
    if (node.id) {
      items.push({ ...node, level });
    }
    if (node.children) {
      node.children.forEach((child) => {
        items.push(...getAllItems(child, level + 1));
      });
    }
    return items;
  };

  const allItems = getAllItems(tree);
  const availableIds = getAllComponentIds();

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Динамічна система навігації</h1>

      {/* Информация о дереве */}
      <div
        style={{
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h3>Інформація про дерево</h3>
        <p>
          <strong>Всього елементів:</strong> {allItems.length}
        </p>
        <p>
          <strong>Доступних компонентів:</strong> {availableIds.length}
        </p>
        <p>
          <strong>Кореневий ID:</strong> {tree.id}
        </p>
      </div>

      {/* Поиск по ID */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Пошук компонента по ID</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            placeholder="Введіть ID компонента..."
            style={{
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              flex: 1,
            }}
          />
          <button
            onClick={() => setSelectedId("")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Очистити
          </button>
        </div>

        {selectedId && (
          <div
            style={{
              padding: "10px",
              background: hasComponent(selectedId) ? "#d4edda" : "#f8d7da",
              border: `1px solid ${hasComponent(selectedId) ? "#c3e6cb" : "#f5c6cb"}`,
              borderRadius: "4px",
            }}
          >
            <div>
              <strong>ID:</strong> {selectedId}
            </div>
            <div>
              <strong>Компонент існує:</strong>{" "}
              {hasComponent(selectedId) ? "✅ Так" : "❌ Ні"}
            </div>
            {hasComponent(selectedId) && (
              <div>
                <strong>Компонент:</strong> Lazy Component
              </div>
            )}
          </div>
        )}
      </div>

      {/* Список всех элементов дерева */}
      <div>
        <h3>Структура дерева навігації</h3>
        <div
          style={{
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid #ddd",
            borderRadius: "4px",
          }}
        >
          {allItems.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              style={{
                padding: "8px 12px",
                borderBottom: "1px solid #eee",
                marginLeft: `${item.level * 20}px`,
                backgroundColor: item.level % 2 === 0 ? "#f8f9fa" : "white",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <strong>{item.id}</strong>
                {item.label && (
                  <div style={{ fontSize: "12px", color: "#666" }}>
                    {item.label.ua && `🇺🇦 ${item.label.ua}`}
                    {item.label.ru && ` | 🇷🇺 ${item.label.ru}`}
                    {item.label.en && ` | 🇬🇧 ${item.label.en}`}
                  </div>
                )}
                <div style={{ fontSize: "12px", color: "#999" }}>
                  Тип: {item.kind} | Показувати в меню:{" "}
                  {item.showInMenu ? "Так" : "Ні"} | Компонент:{" "}
                  {hasComponent(item.id) ? "✅" : "❌"}
                </div>
              </div>
              <button
                onClick={() => setSelectedId(item.id)}
                style={{
                  padding: "4px 8px",
                  fontSize: "12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Вибрати
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Список доступных компонентов */}
      <div style={{ marginTop: "20px" }}>
        <h3>Доступні компоненти ({availableIds.length})</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "8px",
            maxHeight: "200px",
            overflow: "auto",
          }}
        >
          {availableIds.map((id) => (
            <div
              key={id}
              style={{
                padding: "8px",
                background: "#e9ecef",
                borderRadius: "4px",
                fontSize: "12px",
                cursor: "pointer",
                border:
                  selectedId === id ? "2px solid #007bff" : "1px solid #dee2e6",
              }}
              onClick={() => setSelectedId(id)}
            >
              {id}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DynamicNavExample;
