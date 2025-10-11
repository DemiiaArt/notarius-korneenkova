import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "@vuer-ai/react-helmet-async";
import ModalProvider from "@components/ModalProvider/ModalProvider";
import App from "./App.jsx";
import "./main.scss";

// import "./styles/_reset.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ModalProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <App />
        </Router>
      </ModalProvider>
    </HelmetProvider>
  </StrictMode>
);
