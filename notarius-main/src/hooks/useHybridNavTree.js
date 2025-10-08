import { useState, useEffect, useCallback } from "react";
import { NAV_TREE } from "../nav/nav-tree";
import { attachComponentsToTree } from "../nav/component-registry";
import { updateIndices } from "../nav/indices";

import { API_BASE_URL } from "../config/api";
// Кеширование отключено
// const CHILDREN_CACHE_KEY = "nav_children_cache";
// const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

// // Функция для сохранения кеша детей
// const saveChildrenToCache = (parentId, children) => {
//   try {
//     const cacheData = {
//       children,
//       timestamp: Date.now(),
//     };
//     localStorage.setItem(
//       `${CHILDREN_CACHE_KEY}_${parentId}`,
//       JSON.stringify(cacheData)
//     );
//   } catch (error) {
//     console.warn(`Failed to save children cache for ${parentId}:`, error);
//   }
// };

// // Функция для получения кеша детей
// const getChildrenFromCache = (parentId) => {
//   try {
//     const cached = localStorage.getItem(`${CHILDREN_CACHE_KEY}_${parentId}`);
//     if (!cached) return null;

//     const { children, timestamp } = JSON.parse(cached);
//     const now = Date.now();

//     // Проверяем, не устарел ли кеш
//     if (now - timestamp > CACHE_DURATION) {
//       localStorage.removeItem(`${CHILDREN_CACHE_KEY}_${parentId}`);
//       return null;
//     }

//     return children;
//   } catch (error) {
//     console.warn(`Failed to load children cache for ${parentId}:`, error);
//     localStorage.removeItem(`${CHILDREN_CACHE_KEY}_${parentId}`);
//     return null;
//   }
// };

// Функция для загрузки полного дерева с backend
const fetchAllServicesFromBackend = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/services/`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Backend возвращает данные в формате { value: [...] }
    let result = [];
    if (data && data.value && Array.isArray(data.value)) {
      result = data.value;
    } else if (Array.isArray(data)) {
      result = data;
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Функция для поиска узла по ID в дереве
const findNodeById = (nodes, targetId) => {
  for (const node of nodes) {
    if (node.id === targetId) {
      return node;
    }
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, targetId);
      if (found) return found;
    }
  }
  return null;
};

// Функция для получения детей узла из полного дерева backend
const getChildrenByParentId = (backendTree, parentId) => {
  const parentNode = findNodeById(backendTree, parentId);
  return parentNode ? parentNode.children || [] : [];
};

// Простая функция для объединения статического дерева с backend данными
const mergeStaticWithBackendData = (staticTree, backendData) => {
  console.log("🔄 Starting merge process...");
  console.log("📦 Static NAV_TREE:", staticTree);
  console.log("🌐 Backend data:", backendData);

  // Создаем карту backend данных по ID для быстрого поиска
  const backendMap = {};
  const buildBackendMap = (nodes) => {
    if (Array.isArray(nodes)) {
      nodes.forEach((node) => {
        backendMap[node.id] = node;
        if (node.children) {
          buildBackendMap(node.children);
        }
      });
    }
  };

  buildBackendMap(backendData);
  console.log("🗺️ Backend map created:", backendMap);

  const mergeNode = (node) => {
    const mergedNode = { ...node };

    // Если есть backend данные для этого ID, объединяем все свойства
    if (backendMap[node.id]) {
      const backendNode = backendMap[node.id];

      // Объединяем все свойства из backend (showMegaPanel, showInMenu, label, slug и т.д.)
      Object.keys(backendNode).forEach((key) => {
        if (key !== "children") {
          // Никогда не переносим поле component из backend,
          // чтобы не ломать привязку к локальному реестру компонентов
          if (key === "component") {
            return;
          }
          // Преобразуем card_image в cardImage (camelCase)
          if (key === "card_image") {
            mergedNode.cardImage = backendNode[key];
            console.log(
              `✅ Merging node "${node.id}": cardImage =`,
              backendNode[key]
            );
          } else {
            mergedNode[key] = backendNode[key];
          }
        }
      });

      // Обрабатываем children отдельно
      if (backendNode.children) {
        mergedNode.children = [...backendNode.children];
      }
    } else if (node.children) {
      // Иначе рекурсивно обрабатываем статических детей
      mergedNode.children = node.children.map(mergeNode);
    }

    return mergedNode;
  };

  const result = mergeNode(staticTree);
  console.log("✨ Merge complete! Final result:", result);
  return result;
};

export const useHybridNavTree = () => {
  const [navTree, setNavTree] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendTree, setBackendTree] = useState([]);
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [mergeComplete, setMergeComplete] = useState(false);

  // Проверяем, что NAV_TREE импортирован корректно
  if (!NAV_TREE) {
    throw new Error("NAV_TREE is not properly imported");
  }

  // Инициализация статического дерева
  useEffect(() => {
    try {
      setLoading(true);
      setError(null);

      // Прикрепляем компоненты к статическому дереву
      let staticTreeWithComponents;
      try {
        staticTreeWithComponents = attachComponentsToTree(NAV_TREE);
      } catch (componentError) {
        staticTreeWithComponents = NAV_TREE; // Используем без компонентов
      }

      // Обновляем индексы на основе статического дерева
      try {
        updateIndices(NAV_TREE);
      } catch (indexError) {
        // Продолжаем без обновления индексов
      }

      setNavTree(staticTreeWithComponents);
    } catch (err) {
      setError(err.message);
      setNavTree(NAV_TREE); // Используем без компонентов
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция для загрузки полного дерева с backend
  const loadBackendTree = useCallback(async (forceRefresh = false) => {
    // Кеширование отключено
    // if (!forceRefresh) {
    //   const cachedTree = getChildrenFromCache("backend_tree");
    //   if (cachedTree) {
    //     console.log("📦 Using cached backend tree:", cachedTree);
    //     setBackendTree(cachedTree);
    //     setBackendLoaded(true);
    //     return cachedTree;
    //   }
    // }

    try {
      const tree = await fetchAllServicesFromBackend();

      // Сохраняем в состояние
      setBackendTree(tree);
      setBackendLoaded(true);

      // Кеширование отключено
      // saveChildrenToCache("backend_tree", tree);

      return tree;
    } catch (error) {
      throw error;
    }
  }, []);

  // Функция для объединения статического дерева с backend данными
  const mergeWithBackendData = useCallback(
    async (forceRefresh = false) => {
      try {
        // Загружаем backend данные напрямую, не полагаясь на состояние
        const freshBackendData = await loadBackendTree(forceRefresh);

        // Объединяем статическое дерево с backend данными
        const mergedTree = mergeStaticWithBackendData(
          NAV_TREE,
          freshBackendData
        );

        // Прикрепляем компоненты к объединенному дереву
        const treeWithComponents = attachComponentsToTree(mergedTree);

        // Обновляем состояние
        setNavTree(treeWithComponents);
        setMergeComplete(true);

        // Обновляем индексы на основе объединенного дерева
        updateIndices(mergedTree);

        return treeWithComponents;
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [loadBackendTree]
  );

  // Автоматически загружаем и объединяем данные с backend при инициализации
  useEffect(() => {
    let isMounted = true;

    const loadAndMergeBackendData = async () => {
      if (!isMounted) return;

      try {
        // Загружаем и объединяем данные с backend
        await mergeWithBackendData();
      } catch (error) {
        // Обрабатываем ошибку молча
      }
    };

    // Запускаем загрузку после небольшой задержки, чтобы статическое дерево успело инициализироваться
    const timeoutId = setTimeout(loadAndMergeBackendData, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []); // Убираем зависимости, чтобы эффект выполнился только один раз

  // Кеширование отключено
  const clearCache = useCallback(() => {
    // localStorage.removeItem(`${CHILDREN_CACHE_KEY}_backend_tree`);

    setBackendTree([]);
    setBackendLoaded(false);
    setMergeComplete(false);

    // Пересоздаем дерево только со статическими данными
    const staticTreeWithComponents = attachComponentsToTree(NAV_TREE);
    setNavTree(staticTreeWithComponents);
    updateIndices(NAV_TREE);
  }, []);

  return {
    navTree,
    loading,
    error,
    clearCache,
    mergeWithBackendData,
    backendTree,
    backendLoaded,
    mergeComplete,
  };
};
