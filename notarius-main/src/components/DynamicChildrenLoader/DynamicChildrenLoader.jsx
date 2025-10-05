import React, { useEffect, useState } from "react";
import { useHybridNav } from "../../contexts/HybridNavContext";
import { useParams, useLocation } from "react-router-dom";

const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
      fontSize: "16px",
      color: "#666",
    }}
  >
    Завантаження підрозділів...
  </div>
);

const ErrorComponent = ({ error, onRetry }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center",
      border: "2px solid #dc3545",
      borderRadius: "8px",
      backgroundColor: "#f8d7da",
      color: "#721c24",
      margin: "20px 0",
    }}
  >
    <h4>Помилка завантаження підрозділів</h4>
    <p style={{ margin: "10px 0" }}>{error}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        style={{
          padding: "8px 16px",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Спробувати знову
      </button>
    )}
  </div>
);

const EmptyChildrenComponent = ({ parentId }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      textAlign: "center",
      color: "#666",
      fontStyle: "italic",
    }}
  >
    Підрозділи для цього розділу поки що не доступні
  </div>
);

/**
 * Компонент для динамической загрузки и отображения детей узла навигации
 * @param {Object} props - пропсы компонента
 * @param {string} props.parentId - ID родительского узла
 * @param {React.Component} props.childrenRenderer - компонент для рендеринга детей
 * @param {boolean} props.autoLoad - автоматически загружать детей при монтировании
 * @param {React.Component} props.loadingComponent - кастомный компонент загрузки
 * @param {React.Component} props.errorComponent - кастомный компонент ошибки
 * @param {React.Component} props.emptyComponent - кастомный компонент для пустого состояния
 */
const DynamicChildrenLoader = ({
  parentId,
  childrenRenderer,
  autoLoad = true,
  loadingComponent = LoadingSpinner,
  errorComponent = ErrorComponent,
  emptyComponent = EmptyChildrenComponent,
  ...props
}) => {
  const { loadChildren, areChildrenLoaded, areChildrenLoading } =
    useHybridNav();

  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const params = useParams();
  const location = useLocation();

  // Определяем parentId из пропсов или параметров маршрута
  const actualParentId = parentId || params.id;

  // Автоматическая загрузка детей
  useEffect(() => {
    if (autoLoad && actualParentId && !areChildrenLoaded(actualParentId)) {
      handleLoadChildren();
    }
  }, [autoLoad, actualParentId, areChildrenLoaded]);

  const handleLoadChildren = async (forceRefresh = false) => {
    if (!actualParentId) return;

    try {
      setError(null);
      await loadChildren(actualParentId, forceRefresh);
      setRetryCount(0);
    } catch (err) {
      console.error(`Error loading children for ${actualParentId}:`, err);
      setError(err.message);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    handleLoadChildren(true);
  };

  // Если нет parentId
  if (!actualParentId) {
    return null;
  }

  // Если загружаются дети
  if (areChildrenLoading(actualParentId)) {
    return React.createElement(loadingComponent, { parentId: actualParentId });
  }

  // Если произошла ошибка
  if (error) {
    return React.createElement(errorComponent, {
      error,
      onRetry: handleRetry,
      parentId: actualParentId,
    });
  }

  // Если дети не загружены и не загружаются
  if (!areChildrenLoaded(actualParentId)) {
    return null;
  }

  // Если есть компонент для рендеринга детей, используем его
  if (childrenRenderer) {
    return React.createElement(childrenRenderer, {
      parentId: actualParentId,
      ...props,
    });
  }

  // По умолчанию показываем пустое состояние
  return React.createElement(emptyComponent, { parentId: actualParentId });
};

export default DynamicChildrenLoader;
