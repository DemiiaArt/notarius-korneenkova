import { useState, useEffect } from "react";
import { useIsPC } from "@hooks/isPC";
import "./FreeConsult.scss";
import { useModal } from "@components/ModalProvider/ModalProvider";
import { useFreeConsultations } from "@hooks/useFreeConsultations";

const formName = "freeConsult";

export const FreeConsult = () => {
  const { close, getOpenModalState } = useModal();
  const openModalState = getOpenModalState(formName);

  const [formData, setFormData] = useState({
    name: "",
    tel: "",
    city: "",
    question: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    tel: "",
    city: "",
    question: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const isPC = useIsPC();
  const { submitConsultation, loading: isLoading } = useFreeConsultations();

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
    setFormData({ name: "", tel: "", city: "", question: "" });
    setErrors({ name: "", tel: "", city: "", question: "" });
    setIsSubmitted(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: "", tel: "", city: "", question: "" });

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

    if (!formData.city.trim()) {
      setErrors((prev) => ({
        ...prev,
        city: "Поле місто обов’язкове",
      }));
      hasError = true;
    }

    if (!formData.question.trim()) {
      setErrors((prev) => ({
        ...prev,
        question: "Поле питання не може бути порожнім",
      }));
      hasError = true;
    }

    if (hasError) return;

    // Отправляем данные на сервер через новый API для бесплатных консультаций
    const result = await submitConsultation({
      name: formData.name,
      phone_number: formData.tel,
      city: formData.city,
      question: formData.question
    });

    if (result.success) {
      setIsSubmitted(true);
      // Очищаем форму и закрываем модалку через 2 секунды
      setTimeout(() => {
        handleClose();
      }, 2000);
    } else {
      setErrors((prev) => ({
        ...prev,
        tel: result.message || "Помилка при відправці. Спробуйте ще раз.",
      }));
    }
  };

  return (
    <div className={`free-form ${openModalState ? "open" : ""}`}>
      <div className="container">
        <div className="form-container bg1 c3 uppercase">
          <button
            className="close-btn"
            onClick={handleClose}
            aria-label="Закрити"
          ></button>

          <div className="form-content">
            <h2
              className={`fw-bold ${
                isPC ? "fs-p--30px" : "fs-p--16px"
              }`}
            >
              отримати безкоштовну консультацію
            </h2>
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
                id="free-consult-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ім'я"
                className={`c3 ${errors.name ? "error" : ""}`}
                disabled={isSubmitted}
              />
              {errors.name ? (
                <span className="error-label">{errors.name}</span>
              ) : (
                <label htmlFor="free-consult-name">Ім’я</label>
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
                id="free-consult-tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="Номер телефону"
                className={`c3 ${errors.tel ? "error" : ""}`}
                disabled={isSubmitted}
              />
              {errors.tel ? (
                <span className="error-label">{errors.tel}</span>
              ) : (
                <label htmlFor="free-consult-tel">Номер телефону</label>
              )}
            </div>

            {/* city */}
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c3 lh-150`}
            >
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Місто"
                className={`c3 ${errors.city ? "error" : ""}`}
                disabled={isSubmitted}
              />
              {errors.city ? (
                <span className="error-label">{errors.city}</span>
              ) : (
                <label htmlFor="city">Місто</label>
              )}
            </div>

            {/* question */}
            <div
              className={`input-group ${
                isPC ? "fs-p--18px" : "fs-p--10px"
              } c3 lh-150`}
            >
              <textarea
                id="question"
                name="question"
                value={formData.question}
                onChange={(e) => {
                  handleChange(e);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight - 15}px`;
                }}
                placeholder="Питання, яке вас цікавить"
                rows={1}
                className={errors.question ? "error" : ""}
                disabled={isSubmitted}
              />
              {errors.question && (
                <span className="error-label">{errors.question}</span>
              )}
              <label htmlFor="question">Питання, яке вас цікавить</label>
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