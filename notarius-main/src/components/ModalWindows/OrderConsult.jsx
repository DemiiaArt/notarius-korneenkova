import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import "./FreeConsult.scss";
import "./OrderConsult.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useTranslation } from "@hooks/useTranslation";

const formName = "freeOrder";

export const OrderConsult = () => {
  const { getTranslations } = useTranslation("components.OrderConsult");
  const translations = getTranslations();
  const { title, description, fields, validation, buttons, closeButton } =
    translations;

  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    question: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    tel: "",
    question: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { close, getOpenModalState } = useModal();
  const openModalState = getOpenModalState(formName);

  const isPC = useIsPC();

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
          3000
        );
        timers.push(t);
      }
    });
    return () => timers.forEach((t) => clearTimeout(t));
  }, [errors]);

  const handleClose = () => {
    close(formName);
    setFormData({ name: "", tel: "", question: "" });
    setErrors({ name: "", tel: "", question: "" });
    setIsSubmitted(false);
    setIsLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", tel: "", question: "" });

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

    if (!formData.question.trim()) {
      setErrors((prev) => ({
        ...prev,
        question:
          validation?.questionRequired || "Поле питання не може бути порожнім",
      }));
      hasError = true;
    }

    if (hasError) return;

    setIsLoading(true);

    try {
      // имитация запроса
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsSubmitted(true);
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        tel:
          validation?.submitError || "Помилка при відправці. Спробуйте ще раз.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`order-form ${openModalState ? "open" : ""}`}>
      <div className="container">
        <div className="form-container bg1 c3 ">
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label={closeButton || "Закрити"}
          ></button>
          <div className="form-content">
            <h2
              className={`fw-bold ${
                isPC ? "fs-p--30px" : "fs-p--16px"
              } c3 uppercase`}
            >
              {title || "Замовити консультацію"}
            </h2>
            <p className={`${isPC ? "fs-p--24px" : "fs-p--14px"} lh-100 c3`}>
              {description ||
                "Бажаєте отримати консультацію юриста? Заповніть форму нижче."}
            </p>
          </div>

          <form
            className="application-form input-white"
            onSubmit={handleSubmit}
          >
            {/* name */}
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c3 lh-150`}
            >
              <input
                type="text"
                id="order-consult-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={fields?.name?.placeholder || "Ім'я"}
                className={`c3 ${errors.name ? "error" : ""}`}
                disabled={isSubmitted}
              />
              {errors.name ? (
                <span className="error-label">{errors.name}</span>
              ) : (
                <label htmlFor="order-consult-name">
                  {fields?.name?.label || "Ім'я"}
                </label>
              )}
            </div>

            {/* tel */}
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c3 lh-150`}
            >
              <input
                type="tel"
                id="order-consult-tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder={fields?.phone?.placeholder || "Номер телефону"}
                className={`c3 ${errors.tel ? "error" : ""}`}
                disabled={isSubmitted}
              />
              {errors.tel ? (
                <span className="error-label">{errors.tel}</span>
              ) : (
                <label htmlFor="order-consult-tel">
                  {fields?.phone?.label || "Номер телефону"}
                </label>
              )}
            </div>

            {/* question */}
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c3 lh-150`}
            >
              <textarea
                id="order-question"
                name="question"
                value={formData.question}
                onChange={(e) => {
                  handleChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight - 10}px`;
                }}
                placeholder={
                  fields?.question?.placeholder || "Питання, яке вас цікавить"
                }
                rows={1}
                className={errors.question ? "error" : ""}
                disabled={isSubmitted}
              />
              {errors.question && (
                <span className="error-label">{errors.question}</span>
              )}
              <label htmlFor="order-question">
                {fields?.question?.label || "Питання, яке вас цікавить"}
              </label>
            </div>

            {/* submit */}
            <button
              type="submit"
              className={`btn-submit ${
                isPC ? "fs-p--24px" : "fs-p--14px"
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

export default OrderConsult;
