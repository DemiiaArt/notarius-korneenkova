import { useState, useEffect } from "react";
import "./Form.scss";
import { useIsPC } from "@hooks/isPC";

export const Form = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorName, setErrorName] = useState("");
  const [errorTel, setErrorTel] = useState("");

  const isPC = useIsPC();

  // валидация телефона
  const validatePhone = (phone) => {
    const regex = /^(\+380\d{9}|0\d{9})$/;
    return regex.test(phone.trim());
  };

  // автоочистка ошибок через 30 сек
  useEffect(() => {
    if (errorName) {
      const t = setTimeout(() => setErrorName(""), 30000);
      return () => clearTimeout(t);
    }
  }, [errorName]);

  useEffect(() => {
    if (errorTel) {
      const t = setTimeout(() => setErrorTel(""), 30000);
      return () => clearTimeout(t);
    }
  }, [errorTel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorName("");
    setErrorTel("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const tel = formData.get("tel");

    let hasError = false;

    if (!name.trim()) {
      setErrorName("Поле ім’я обов’язкове");
      hasError = true;
    }

    if (!validatePhone(tel)) {
      setErrorTel("Введіть номер у форматі: +380....");
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setErrorTel("Помилка при відправці. Спробуйте ще раз.");
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
              Не знаєте з чого почати? <br />
              Залиште заявку.
            </h2>
            <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} lh-150 uppercase`}>
              Ваша ситуація – <span className="fw-bold">не глухий кут</span>.
              <br />
              Заповніть форму і ви отримаєте
              <br />
              <span className="fw-bold">Перший крок до вирішення</span>.
            </p>
          </div>
          <form className="application-form input-black" onSubmit={handleSubmit}>
            <div className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Ім'я"
                className={`c1 ${errorName ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorName ? (
                <span className="error-label">{errorName}</span>
              ) : (
                <label htmlFor="name">Ім’я</label>
              )}
            </div>
            <div className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}>
              <input
                type="tel"
                id="tel"
                name="tel"
                placeholder="Номер телефону"
                className={`c1 ${errorTel ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorTel ? (
                <span className="error-label">{errorTel}</span>
              ) : (
                <label htmlFor="tel">Номер телефону</label>
              )}
            </div>

            <button
              type="submit"
              className={`btn-submit ${isPC ? "fs-p--24px" : "fs-p--14px"} bg4 c1 fw-normal uppercase`}
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