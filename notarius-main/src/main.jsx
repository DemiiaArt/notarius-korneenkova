import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ModalProvider from "@components/ModalProvider/ModalProvider";
import App from "./App.jsx";
import "./main.scss";

// import "./styles/_reset.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModalProvider>
      <Router>
        <App />
      </Router>
    </ModalProvider>
  </StrictMode>
);
