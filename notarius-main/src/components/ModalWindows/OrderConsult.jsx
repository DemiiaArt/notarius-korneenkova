import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import "./FreeConsult.scss";
import "./OrderConsult.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

const formName = "freeOrder";

export const OrderConsult = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [errorQuestion, setErrorQuestion] = useState("");
  const [errorName, setErrorName] = useState("");
  const [errorTel, setErrorTel] = useState("");

  const { close, getOpenModalState } = useModal();

  const openModalState = getOpenModalState(formName);

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
    setErrorQuestion("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const tel = formData.get("tel");
    const question = formData.get("order-question");

    let hasError = false;

    if (!name.trim()) {
      setErrorName("Поле ім’я обов’язкове");
      hasError = true;
    }

    if (!validatePhone(tel)) {
      setErrorTel("Введіть номер у форматі: +380....");
      hasError = true;
    }

    if (!question.trim() || question.trim().length < 1) {
      setErrorQuestion("Поле питання не може бути порожнім");
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
  const isPC = useIsPC();

  return (
    <div className={`order-form ${openModalState ? "open" : ""}`}>
      <div className="container">
        <div className="form-container bg1 c3 ">
          <button
            className="close-btn"
            onClick={() => close(formName)}
            aria-label="Закрити"
          ></button>
          <div className="form-content">
            <h2
              className={`fw-bold ${isPC ? "fs-p--30px" : "fs-p--16px"} c3 uppercase`}
            >
              Замовити консультацію
            </h2>
            <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} lh-100 c3`}>
              Бажаєте отримати консультацію юриста? Заповніть форму нижче.
            </p>
          </div>
          <form
            className="application-form input-white"
            onSubmit={handleSubmit}
          >
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <input
                type="text"
                id="order-consult-name"
                name="name"
                placeholder="Ім'я"
                className={`c3 ${errorName ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorName ? (
                <span className="error-label">{errorName}</span>
              ) : (
                <label htmlFor="order-consult-name">Ім’я</label>
              )}
            </div>
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <input
                type="tel"
                id="order-consult-tel"
                name="tel"
                placeholder="Номер телефону"
                className={`c3 ${errorTel ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorTel ? (
                <span className="error-label">{errorTel}</span>
              ) : (
                <label htmlFor="order-consult-tel">Номер телефону</label>
              )}
            </div>
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c3 lh-150`}
            >
              <textarea
                name="order-question"
                placeholder="Питання, яке вас цікавить"
                value={text}
                id="order-question"
                required
                onChange={(e) => {
                  setText(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight - 15}px`;
                }}
                rows={1}
                className={errorQuestion ? "error" : ""}
                disabled={isSubmitted}
              />
              {errorQuestion && (
                <span className="error-label">{errorQuestion}</span>
              )}
              <label htmlFor="order-question">Питання, яке вас цікавить</label>
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

export default OrderConsult;
