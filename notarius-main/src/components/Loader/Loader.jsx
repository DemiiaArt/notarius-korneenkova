// src/components/Loader/Loader.jsx
import React from "react";
import "./Loader.scss";

const Loader = ({
  message = "Завантаження...",
  size = "medium",
  variant = "spinner",
  showMessage = true,
}) => {
  return (
    <div className={`loader loader--${size} loader--${variant}`}>
      <div className="loader__container">
        {variant === "spinner" && (
          <div className="loader__spinner">
            <div className="loader__spinner-ring"></div>
            <div className="loader__spinner-ring"></div>
            <div className="loader__spinner-ring"></div>
          </div>
        )}

        {variant === "dots" && (
          <div className="loader__dots">
            <div className="loader__dot"></div>
            <div className="loader__dot"></div>
            <div className="loader__dot"></div>
          </div>
        )}

        {variant === "pulse" && (
          <div className="loader__pulse">
            <div className="loader__pulse-circle"></div>
          </div>
        )}

        {showMessage && <div className="loader__message">{message}</div>}
      </div>
    </div>
  );
};

export default Loader;
