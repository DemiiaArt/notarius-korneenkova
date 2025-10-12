import "./App.scss";
import LeadsButton from "@components/LeadsButton/LeadsButton";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import FreeConsult from "@components/ModalWindows/FreeConsult";
import OrderConsult from "@components/ModalWindows/OrderConsult";
import BreadcrumbSchema from "@components/SEO/BreadcrumbSchema";
import AppRoutes from "./routes/AppRoutes";
import { HybridNavProvider } from "./contexts/HybridNavContext";
import { LanguageProvider } from "./hooks/useLanguage";
import { useHybridNavTree } from "./hooks/useHybridNavTree";
import "./nav/attach-components";

// Внутренний компонент, который использует useHybridNav
const AppContent = ({ navTree, loading, error }) => {
  // Показываем загрузку
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Завантаження навігації...
      </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <h2>Помилка завантаження навігації</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Спробувати знову
        </button>
      </div>
    );
  }

  // Если нет навигационного дерева
  if (!navTree) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Навігація не знайдена
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="main">
        <ScrollToTop behavior="smooth" />
        <LeadsButton />
        <AppRoutes />
      </main>

      <Footer />
      <FreeConsult />
      <OrderConsult />
      <BreadcrumbSchema />
    </>
  );
};

function App() {
  // Используем useHybridNavTree на верхнем уровне
  const hybridNavData = useHybridNavTree();

  return (
    <LanguageProvider navTree={hybridNavData.navTree}>
      <HybridNavProvider value={hybridNavData}>
        <AppContent
          navTree={hybridNavData.navTree}
          loading={hybridNavData.loading}
          error={hybridNavData.error}
        />
      </HybridNavProvider>
    </LanguageProvider>
  );
}

export default App;
