import { useState, useEffect } from "react";
import "./Form.scss";
import { useIsPC } from "@hooks/isPC";
import { useTranslation } from "@hooks/useTranslation";
import { apiClient } from "@/config/api";

export const Form = () => {
  const [formData, setFormData] = useState({
    name: "",
    tel: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    tel: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isPC = useIsPC();
  const { getTranslations } = useTranslation("components.Form");

  // Получаем переводы для компонента
  const translations = getTranslations();
  const { title, description, fields, validation, buttons } = translations;

  // валидация телефона
  const validatePhone = (phone) => {
    const regex = /^(\+380\d{9}|0\d{9})$/;
    return regex.test(phone.trim());
  };

  // автоочистка ошибок через 30 сек
  useEffect(() => {
    const timers = [];
    Object.entries(errors).forEach(([key, value]) => {
      if (value) {
        const t = setTimeout(
          () => setErrors((prev) => ({ ...prev, [key]: "" })),
          30000
        );
        timers.push(t);
      }
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [errors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", tel: "" });
    setSubmitError("");

    let hasError = false;

    if (!formData.name.trim()) {
      setErrors((prev) => ({
        ...prev,
        name: validation?.nameRequired || "Поле ім'я обов'язкове",
      }));
      hasError = true;
    }

    if (!validatePhone(formData.tel)) {
      setErrors((prev) => ({
        ...prev,
        tel: validation?.phoneInvalid || "Введіть номер у форматі: +380....",
      }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // Отправляем данные на бэкенд
      const response = await apiClient.post("/applications/", {
        name: formData.name.trim(),
        phone_number: formData.tel.trim(),
      });

      console.log("✅ Заявка успешно отправлена:", response);

      // Очищаем форму и показываем успех
      setIsSubmitted(true);
      setFormData({ name: "", tel: "" });

      // Сбрасываем статус через 5 секунд, чтобы можно было отправить еще раз
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error("❌ Ошибка при отправке заявки:", err);

      const errorMessage =
        err.message ||
        validation?.submitError ||
        "Помилка при відправці. Спробуйте ще раз.";
      setSubmitError(errorMessage);

      setErrors((prev) => ({
        ...prev,
        tel: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-block">
      <div className="container">
        <div className="form-container bg3 c1 uppercase">
          <div className="form-content">
            <h2 className={`fw-bold ${isPC ? "fs-p--30px" : "fs-p--16px"}`}>
              {title?.line1 || "Не знаєте з чого почати?"} <br />
              {title?.line2 || "Залиште заявку."}
            </h2>
            <p
              className={`${
                isPC ? "fs-p--24px" : "fs-p--14px"
              } lh-150 uppercase`}
            >
              {description?.line1 || "Ваша ситуація –"}{" "}
              <span className="fw-bold">
                {description?.highlight1 || "не глухий кут"}
              </span>
              .
              <br />
              {description?.line2 || "Заповніть форму і ви отримаєте"}
              <br />
              <span className="fw-bold">
                {description?.line3 || "Перший крок до вирішення"}
              </span>
              .
            </p>
          </div>
          <form
            className="application-form input-black"
            onSubmit={handleSubmit}
          >
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c1 lh-150`}
            >
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={fields?.name?.placeholder || "Ім'я"}
                className={`c1 ${errors.name ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errors.name ? (
                <span className="error-label">{errors.name}</span>
              ) : (
                <label htmlFor="name">{fields?.name?.label || "Ім'я"}</label>
              )}
            </div>
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c1 lh-150`}
            >
              <input
                type="tel"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder={fields?.phone?.placeholder || "Номер телефону"}
                className={`c1 ${errors.tel ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errors.tel ? (
                <span className="error-label">{errors.tel}</span>
              ) : (
                <label htmlFor="tel">
                  {fields?.phone?.label || "Номер телефону"}
                </label>
              )}
            </div>

            {submitError && (
              <div
                className={`error-message ${isPC ? "fs-p--14px" : "fs-p--12px"}`}
                style={{ color: "#ff4444", marginTop: "10px" }}
              >
                {submitError}
              </div>
            )}

            <button
              type="submit"
              className={`btn-submit ${
                isPC ? "fs-p--16px" : "fs-p--12px"
              } bg4 c1 fw-normal uppercase`}
              disabled={isSubmitted || isLoading}
            >
              {isSubmitted
                ? buttons?.success || "Ваша заявка успішно відправлена"
                : isLoading
                  ? buttons?.loading || "Відправка..."
                  : buttons?.submit || "ВІДПРАВИТИ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;
