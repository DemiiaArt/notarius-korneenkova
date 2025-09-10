import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import ModalProvider from "@components/ModalProvider/ModalProvider";
import { LanguageProvider } from "@hooks/useLanguage";
import App from "./App.jsx";
import "./main.scss";

const skillsContent = {
  main: {
    mainTitleFirstWord: "Професійні",
    mainTitleSecondWord: "Факти",
    experience: {
      count: 2000,
      preCountText: "з ",
      postCountText: " року",
      title: "У юридичній сфері",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
    history: {
      count: 2011,
      preCountText: "з ",
      postCountText: " року",
      title: "У професії нотаріуса",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
    diploms: {
      count: 4,
      preCountText: "",
      postCountText: "",
      title: "Дипломи",
      text: "Економіка, право, бухгалтерський облік, англійська мова",
    },
    happy: {
      count: "10 000+",
      preCountText: "",
      postCountText: "",
      title: "Задоволених клієнтів",
      text: "Досвід у судовій, позовній, арбітражній та іншій юридичній роботі",
    },
  },
  about: {
    mainTitleFirstWord: "Професійні",
    mainTitleSecondWord: "Принципи",
    experience: {
      count: "01",
      preCountText: "",
      postCountText: "",
      title: "Індивідуальний підхід",
      text: "Кожен клієнт — унікальний, тому ми уважно вислуховуємо та підбираємо рішення, що відповідають саме його життєвій ситуації.",
    },
    history: {
      count: "02",
      preCountText: "",
      postCountText: "",
      title: "Конфіденційність",
      text: "Уся отримана інформація залишається строго конфіденційною — довіра клієнтів для нас понад усе.",
    },
    diploms: {
      count: "03",
      preCountText: "",
      postCountText: "",
      title: "Законність та точність",
      text: "У своїй роботі ми керуємося чинним законодавством та дотримуємося максимальної точності в кожній деталі.",
    },
    happy: {
      count: "04",
      preCountText: "",
      postCountText: "",
      title: "Етичність",
      text: "Дотримуємося високих етичних стандартів, поважаючи гідність кожної людини та діючи з чесністю і справедливістю.",
    },
  },
};
// import "./styles/_reset.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <LanguageProvider>
        <ModalProvider>
          <App skillsContent={skillsContent} />
        </ModalProvider>
      </LanguageProvider>
    </Router>
  </StrictMode>
);