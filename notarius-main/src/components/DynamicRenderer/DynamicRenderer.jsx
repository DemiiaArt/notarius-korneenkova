import React, { Suspense } from "react";
import { useDynamicComponent } from "../../hooks/useDynamicComponent";

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
    Завантаження компонента...
  </div>
);

const ErrorComponent = ({ error, id }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      padding: "20px",
      textAlign: "center",
      border: "2px solid #dc3545",
      borderRadius: "8px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
    }}
  >
    <h3>Помилка завантаження компонента</h3>
    <p>
      <strong>ID:</strong> {id}
    </p>
    <p>
      <strong>Помилка:</strong> {error}
    </p>
  </div>
);

const NotFoundComponent = ({ id }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      padding: "20px",
      textAlign: "center",
      border: "2px solid #ffc107",
      borderRadius: "8px",
      backgroundColor: "#fff3cd",
      color: "#856404",
    }}
  >
    <h3>Компонент не знайдено</h3>
    <p>
      Компонент з ID "<strong>{id}</strong>" не зареєстрований
    </p>
  </div>
);

/**
 * Компонент для динамічного рендерингу на основі ID
 * @param {Object} props - пропси компонента
 * @param {string} props.id - ID компонента з реєстру
 * @param {Object} props.componentProps - пропси для компонента
 * @param {React.Component} props.fallback - кастомний fallback компонент
 * @param {React.Component} props.errorComponent - кастомний компонент помилки
 * @param {React.Component} props.notFoundComponent - кастомний компонент "не знайдено"
 */
const DynamicRenderer = ({
  id,
  componentProps = {},
  fallback = LoadingSpinner,
  errorComponent = ErrorComponent,
  notFoundComponent = NotFoundComponent,
}) => {
  const { component, hasComponent, loading, error } = useDynamicComponent(id);

  if (loading) {
    return (
      <Suspense fallback={fallback}>
        <div />
      </Suspense>
    );
  }

  if (error) {
    return errorComponent({ error, id });
  }

  if (!hasComponent) {
    return notFoundComponent({ id });
  }

  if (!component) {
    return notFoundComponent({ id });
  }

  // Рендеримо компонент з пропсами
  return (
    <Suspense fallback={fallback}>
      <component {...componentProps} />
    </Suspense>
  );
};

export default DynamicRenderer;
