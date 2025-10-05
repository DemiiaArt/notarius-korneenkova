import { useMemo } from "react";
import { getComponentById, hasComponent } from "../nav/component-registry";

/**
 * Хук для отримання компонента по ID з реєстру
 * @param {string} id - ID компонента
 * @returns {Object} - { component, hasComponent, loading, error }
 */
export const useDynamicComponent = (id) => {
  return useMemo(() => {
    if (!id) {
      return {
        component: null,
        hasComponent: false,
        loading: false,
        error: "ID is required",
      };
    }

    // Перевіряємо, чи існує компонент в реєстрі
    const componentExists = hasComponent(id);

    if (!componentExists) {
      return {
        component: null,
        hasComponent: false,
        loading: false,
        error: `Component with ID "${id}" not found in registry`,
      };
    }

    // Отримуємо компонент з реєстру
    const component = getComponentById(id);

    return {
      component,
      hasComponent: true,
      loading: false,
      error: null,
    };
  }, [id]);
};
