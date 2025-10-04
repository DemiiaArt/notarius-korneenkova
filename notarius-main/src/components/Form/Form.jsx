import { useState, useEffect } from "react";
import "./Form.scss";
import { useIsPC } from "@hooks/isPC";
import { useApplications } from "@hooks/useApplications";

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

  const isPC = useIsPC();
  const { submitApplication, loading: isLoading } = useApplications();

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

    let hasError = false;

    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Поле ім’я обов’язкове" }));
      hasError = true;
    }

    if (!validatePhone(formData.tel)) {
      setErrors((prev) => ({
        ...prev,
        tel: "Введіть номер у форматі: +380....",
      }));
      hasError = true;
    }

    if (hasError) return;

    // Отправляем заявку на бэкенд
    const result = await submitApplication({
      name: formData.name,
      phone_number: formData.tel
    });

    if (result.success) {
      setIsSubmitted(true);
      // Очищаем форму через 3 секунды после успешной отправки
      setTimeout(() => {
        setFormData({ name: "", tel: "" });
        setIsSubmitted(false);
      }, 3000);
    } else {
      setErrors((prev) => ({
        ...prev,
        tel: result.message || "Помилка при відправці. Спробуйте ще раз.",
      }));
    }
  };

  return (
    <div className="form-block">
      <div className="container">
        <div className="form-container bg3 c1 uppercase">
          <div className="form-content">
            <h2 className={`fw-bold ${isPC ? "fs-p--30px" : "fs-p--16px"}`}>
              Не знаєте з чого почати? <br />
              Залиште заявку.
            </h2>
            <p
              className={`${
                isPC ? "fs-p--24px" : "fs-p--14px"
              } lh-150 uppercase`}
            >
              Ваша ситуація – <span className="fw-bold">не глухий кут</span>.
              <br />
              Заповніть форму і ви отримаєте
              <br />
              <span className="fw-bold">Перший крок до вирішення</span>.
            </p>
          </div>
          <form className="application-form input-black" onSubmit={handleSubmit}>
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
                placeholder="Ім'я"
                className={`c1 ${errors.name ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errors.name ? (
                <span className="error-label">{errors.name}</span>
              ) : (
                <label htmlFor="name">Ім’я</label>
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
                placeholder="Номер телефону"
                className={`c1 ${errors.tel ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errors.tel ? (
                <span className="error-label">{errors.tel}</span>
              ) : (
                <label htmlFor="tel">Номер телефону</label>
              )}
            </div>

            <button
              type="submit"
              className={`btn-submit ${
                isPC ? "fs-p--16px" : "fs-p--12px"
              } bg4 c1 fw-normal uppercase`}
              disabled={isSubmitted || isLoading}
            >
              {isSubmitted
                ? "Ваша заявка успішно відправлена"
                : isLoading
                ? "Відправка..."
                : "ВІДПРАВИТИ"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Form;