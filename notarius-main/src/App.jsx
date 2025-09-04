import "./App.scss";
import LeadsButton from "@components/LeadsButton/LeadsButton";
import MainPage from "@pages/MainPage/MainPage";
import AboutPage from "@pages/AboutPage/AboutPage";
import ServicesPage from "@pages/ServicesPage/ServicesPage";
import Header from "@components/Header/Header";
import Footer from "@components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import NotaryTranslatePage from "@pages/NotaryTranslatePage/NotaryTranslatePage";
import OtherServicesPage from "@pages/OtherServicesPage/OtherServicesPage";
import MilitaryPage from "@pages/MilitaryPage/MilitaryPage";
import ApostillePage from "@pages/ApostillePage/ApostillePage";
import NotFoundPage from "@pages/NotFoundPage/NotFoundPage";
import "./i18n";
import ContactsPage from "@pages/ContactsPage/ContactsPage";
import OfferPage from "@pages/OfferAndPolicy/Offer";
import PolicyPage from "@pages/OfferAndPolicy/Policy";
import ScrollToTop from "@components/ScrollToTop/ScrollToTop";
import TradeMarkPage from "@pages/TradeMarkPage/TradeMarkPage";
import FreeConsult from "@components/ModalWindows/FreeConsult";
import OrderConsult from "@components/ModalWindows/OrderConsult";

function App({ skillsContent }) {
  return (
    <>
      <Header />
      <main className="main">
        <ScrollToTop behavior="smooth" />
        <LeadsButton />
        <Routes>
          {/* UA lang */}
          <Route
            path="/"
            element={<MainPage skillsContent={skillsContent.main} lang="ua" />}
          />
          <Route
            path="/notarialni-pro-mene"
            element={
              <AboutPage skillsContent={skillsContent.about} lang="ua" />
            }
          />
          <Route
            path="/notarialni-poslugy"
            element={<ServicesPage lang="ua" />}
          />
          <Route
            path="/notarialni-pereklad"
            element={<NotaryTranslatePage lang="ua" />}
          />
          <Route
            path="/notarialni-inshi"
            element={<OtherServicesPage lang="ua" />}
          />
          <Route
            path="/notarialni-dopomoga-viyskovim"
            element={<MilitaryPage lang="ua" />}
          />
          <Route
            path="/notarialni-poslugy/apostil-na-dokumenty"
            element={<ApostillePage lang="ua" />}
          />
          <Route
            path="/notarialni-contacty"
            element={<ContactsPage lang="ua" />}
          />
          <Route path="/notarialni-offer" element={<OfferPage lang="ua" />} />
          <Route path="/notarialni-policy" element={<PolicyPage lang="ua" />} />
          <Route
            path="/notarialni-torgivelna-marka"
            element={<TradeMarkPage lang="ua" />}
          />
          <Route path="*" element={<NotFoundPage lang="ua" />} />
          {/* RU lang */}
          <Route
            path="/ru"
            element={<MainPage skillsContent={skillsContent.main} lang="ru" />}
          />
          <Route
            path="/ru/notarialni-pro-mene"
            element={
              <AboutPage skillsContent={skillsContent.about} lang="ru" />
            }
          />
          <Route
            path="/ru/notarialni-poslugy"
            element={<ServicesPage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-pereklad"
            element={<NotaryTranslatePage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-inshi"
            element={<OtherServicesPage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-pomosch-voennym"
            element={<MilitaryPage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-poslugy/apostil-na-dokumenty"
            element={<ApostillePage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-offer"
            element={<OfferPage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-policy"
            element={<PolicyPage lang="ru" />}
          />
          <Route
            path="/notarialni-torgova-marka"
            element={<TradeMarkPage lang="ru" />}
          />
          <Route
            path="/ru/notarialni-contacty"
            element={<ContactsPage lang="ru" />}
          />
          <Route path="/ru/*" element={<NotFoundPage lang="ru" />} />
          {/* EN lang */}
          <Route
            path="/en"
            element={<MainPage skillsContent={skillsContent.main} lang="en" />}
          />
          <Route
            path="/en/notary-about"
            element={
              <AboutPage skillsContent={skillsContent.about} lang="en" />
            }
          />
          <Route
            path="/en/notary-services"
            element={<ServicesPage lang="en" />}
          />
          <Route
            path="/en/notary-translation"
            element={<NotaryTranslatePage lang="en" />}
          />
          <Route
            path="/en/notary-other"
            element={<OtherServicesPage lang="en" />}
          />
          <Route
            path="/en/notary-military-help"
            element={<MilitaryPage lang="en" />}
          />
          <Route
            path="/en/notary-services/apostille"
            element={<ApostillePage lang="en" />}
          />
          <Route path="/en/notary-offer" element={<OfferPage lang="en" />} />
          <Route path="/en/notary-policy" element={<PolicyPage lang="en" />} />
          <Route
            path="/en/notary-contacts"
            element={<ContactsPage lang="en" />}
          />
          <Route
            path="/en/notary-trade-mark"
            element={<TradeMarkPage lang="en" />}
          />
          <Route path="/en/*" element={<NotFoundPage lang="en" />} />
        </Routes>
      </main>
      <Footer />
      <FreeConsult />
      <OrderConsult />
    </>
  );
}

export default App;
