import "./App.scss";
import LeadsButton from "@components/LeadsButton/LeadsButton";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import FreeConsult from "@components/ModalWindows/FreeConsult";
import OrderConsult from "@components/ModalWindows/OrderConsult";
import AppRoutes from "./routes/AppRoutes";
import { HybridNavProvider } from "./contexts/HybridNavContext";
import "./nav/attach-components";

function App() {
  return (
    <HybridNavProvider>
      <Header />
      <main className="main">
        <ScrollToTop behavior="smooth" />
        <LeadsButton />
        <AppRoutes />
      </main>

      <Footer />
      <FreeConsult />
      <OrderConsult />
    </HybridNavProvider>
  );
}

export default App;
