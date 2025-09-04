import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import "./FreeConsult.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";

const formName = "freeConsult";

export const FreeConsult = () => {
  const { close, getOpenModalState } = useModal();

  const openModalState = getOpenModalState(formName);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [errorCity, setErrorCity] = useState("");
  const [errorQuestion, setErrorQuestion] = useState("");
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
    setErrorCity("");
    setErrorQuestion("");

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const tel = formData.get("tel");
    const city = formData.get("city");
    const question = formData.get("question");

    let hasError = false;

    if (!name.trim()) {
      setErrorName("Поле ім’я обов’язкове");
      hasError = true;
    }

    if (!validatePhone(tel)) {
      setErrorTel("Введіть номер у форматі: +380....");
      hasError = true;
    }

    if (!city.trim()) {
      setErrorCity("Поле місто обов’язкове");
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
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      formData.set("name", "");
      formData.set("tel", "");
      formData.set("city", "");
      formData.set("question", "");
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
    } catch (err) {
      setErrorTel("Помилка при відправці. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={`free-form ${openModalState ? "open" : ""}`}>
      <div className="container">
        <div className="form-container bg3 c1 uppercase">
          <button
            className="close-btn"
            onClick={() => close(formName)}
            aria-label="Закрити"
          ></button>
          <div className="form-content">
            <h2 className={`fw-bold ${isPC ? "fs-p--30px" : "fs-p--16px"}`}>
              отримати безкоштовну консультацію
            </h2>
          </div>
          <form
            className="application-form input-black"
            onSubmit={handleSubmit}
          >
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}
            >
              <input
                type="text"
                id="free-consult-name"
                name="name"
                placeholder="Ім'я"
                className={`c1 ${errorName ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorName ? (
                <span className="error-label">{errorName}</span>
              ) : (
                <label htmlFor="free-consult-name">Ім’я</label>
              )}
            </div>
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}
            >
              <input
                type="tel"
                id="free-consult-tel"
                name="tel"
                placeholder="Номер телефону"
                className={`c1 ${errorTel ? "error" : ""}`}
                autoComplete="on"
                disabled={isSubmitted}
              />
              {errorTel ? (
                <span className="error-label">{errorTel}</span>
              ) : (
                <label htmlFor="free-consult-tel">Номер телефону</label>
              )}
            </div>
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}
            >
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Місто"
                className={`c1 ${errorCity ? "error" : ""}`}
                // autoComplete="on"
                disabled={isSubmitted}
              />
              {errorCity ? (
                <span className="error-label">{errorCity}</span>
              ) : (
                <label htmlFor="city">Місто</label>
              )}
            </div>
            <div
              className={`input-group ${isPC ? "fs-p--18px" : "fs-p--10px"} c1 lh-150`}
            >
              <textarea
                name="question"
                placeholder="Питання, яке вас цікавить"
                value={text}
                id="question"
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
              <label htmlFor="question">Питання, яке вас цікавить</label>
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

export default FreeConsult;
