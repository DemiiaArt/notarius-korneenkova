// src/nav/component-registry.js
// Реестр компонентов для динамического прикрепления по ID

import { lazy } from "react";

// Lazy load pages for better performance
const MainPage = lazy(() => import("@pages/MainPage/MainPage"));
const AboutPage = lazy(() => import("@pages/AboutPage/AboutPage"));
const ServicesPage = lazy(() => import("@pages/ServicesPage/ServicesPage"));
const NotaryTranslatePage = lazy(
  () => import("@pages/NotaryTranslatePage/NotaryTranslatePage")
);
const MilitaryPage = lazy(() => import("@pages/MilitaryPage/MilitaryPage"));
const OtherServicesPage = lazy(
  () => import("@pages/OtherServicesPage/OtherServicesPage")
);
const OfferPage = lazy(() => import("@pages/OfferAndPolicy/Offer"));
const PolicyPage = lazy(() => import("@pages/OfferAndPolicy/Policy"));
const ContactsPage = lazy(() => import("@pages/ContactsPage/ContactsPage"));
const TradeMarkPage = lazy(() => import("@pages/TradeMarkPage/TradeMarkPage"));
const MainBlogPage = lazy(() => import("@pages/BlogPage/MainBlogPage"));
const BlogArticlePage = lazy(() => import("@pages/BlogPage/BlogArticlePage"));
const DefaultThirdLevelPage = lazy(
  () => import("@pagesSecondLevel/DefaultThirdLevelPage")
);
const DefaultFourthLevelPage = lazy(
  () => import("@pagesSecondLevel/DefaultFourthLevelPage")
);

// Second level pages
const ContractPage = lazy(
  () => import("@pagesSecondLevel/NotaryServices/ContractPage")
);
const SignaturePage = lazy(
  () => import("@pagesSecondLevel/NotaryServices/SignaturePage")
);
const ConsultationPage = lazy(
  () => import("@pagesSecondLevel/NotaryServices/ConsultationPage")
);
const ApostillePage = lazy(
  () => import("@pagesSecondLevel/NotaryServices/ApostillePage")
);

// Contract pages
const PropertyAgreements = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Contract/PropertyAgreements")
);
const FamilyAgreements = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Contract/FamilyAgreements")
);
const ContractualGuarantees = lazy(
  () =>
    import("@pagesSecondLevel/NotaryServices/Contract/ContractualGuarantees")
);
const InheritanceAgreements = lazy(
  () =>
    import("@pagesSecondLevel/NotaryServices/Contract/InheritanceAgreements")
);
const CorporateRightsAgreements = lazy(
  () =>
    import(
      "@pagesSecondLevel/NotaryServices/Contract/CorporateRightsAgreements"
    )
);
const ExecutiveInscription = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Contract/ExecutiveInscription")
);
const OtherAgreements = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Contract/OtherAgreements")
);

// Attorney pages
const AttorneyPage = lazy(
  () => import("@pagesSecondLevel/NotaryServices/AttorneyPage")
);
const PoaProperty = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Attorney/PoaProperty")
);
const PoaRepresentation = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Attorney/PoaRepresentation")
);
const PoaSpecial = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Attorney/PoaSpecial")
);

// Signature pages
const Signature = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Signature/Signature")
);
const Applications = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Signature/Applications")
);

// Consultation pages
const Consultations = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Consultation/Consultations")
);
const DocumentCopies = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Consultation/DocumentCopies")
);

// Apostille pages
const ApostilleDocs = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Apostille/ApostilleDocs")
);
const Affidavit = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Apostille/Affidavit")
);

// Реестр компонентов по ID
export const COMPONENT_REGISTRY = {
  // Основные страницы
  home: MainPage,
  about: AboutPage,
  services: ServicesPage,
  "notary-translate": NotaryTranslatePage,
  "military-help": MilitaryPage,
  "other-services": OtherServicesPage,
  offer: OfferPage,
  policy: PolicyPage,
  contacts: ContactsPage,
  trademark: TradeMarkPage,
  blog: MainBlogPage,
  "blog-article": BlogArticlePage,
  "default-third-level": DefaultThirdLevelPage,
  "default-fourth-level": DefaultFourthLevelPage,

  // // Группы услуг
  // contracts: ContractPage,
  // "power-of-attorney": AttorneyPage,
  // "signatures-statements": SignaturePage,
  // "consult-copy-duplicate": ConsultationPage,
  // "apostille-affidavit": ApostillePage,

  // Контракты
  // "property-agreements": PropertyAgreements,
  // "family-agreements": FamilyAgreements,
  // "contractual-guarantees": ContractualGuarantees,
  // "inheritance-agreements": InheritanceAgreements,
  // "corporate-rights-agreements": CorporateRightsAgreements,
  // "executive-inscription": ExecutiveInscription,
  // "other-agreements": OtherAgreements,

  // Доверенности
  // "poa-property": PoaProperty,
  // "poa-representation": PoaRepresentation,
  // "poa-special": PoaSpecial,

  // // Подписи и заявления
  // "signatures-consents": Signature,
  // applications: Applications,

  // // Консультации
  // consultations: Consultations,
  // "document-copies": DocumentCopies,

  // // Апостиль
  // "apostille-documents": ApostilleDocs,
  // affidavit: Affidavit,

  // Переводы
  // "translator-signature": lazy(
  //   () => import("@pagesSecondLevel/NotaryTranslate/TranslatorSignature")
  // ),
  // "notarial-translation-one-doc": lazy(
  //   () => import("@pagesSecondLevel/NotaryTranslate/NotarialTranslationOneDoc")
  // ),
  // "two-in-one-copy-translation": lazy(
  //   () => import("@pagesSecondLevel/NotaryTranslate/TwoInOneCopyTranslation")
  // ),

  // // Другие услуги
  // "legal-consultations-with-opinion": lazy(
  //   () =>
  //     import("@pagesSecondLevel/OtherServices/LegalConsultationsWithOpinion")
  // ),
  // "extracts-real-rights-register": lazy(
  //   () => import("@pagesSecondLevel/OtherServices/ExtractsRealRightsRegister")
  // ),
  // "edr-registration": lazy(
  //   () => import("@pagesSecondLevel/OtherServices/EdrRegistration")
  // ),
  // "register-ownership-real-estate": lazy(
  //   () => import("@pagesSecondLevel/OtherServices/RegisterOwnershipRealEstate")
  // ),
  // "edr-error-correction": lazy(
  //   () => import("@pagesSecondLevel/OtherServices/EdrErrorCorrection")
  // ),
  // "rights-register-for-developers": lazy(
  //   () => import("@pagesSecondLevel/OtherServices/RightsRegisterForDevelopers")
  // ),
};

/**
 * Получить компонент по ID
 * @param {string} id - ID компонента
 * @returns {React.Component|null} - React компонент или null
 */
export function getComponentById(id) {
  return COMPONENT_REGISTRY[id] || null;
}

/**
 * Проверить, существует ли компонент для данного ID
 * @param {string} id - ID компонента
 * @returns {boolean} - true если компонент существует
 */
export function hasComponent(id) {
  return id in COMPONENT_REGISTRY;
}

/**
 * Получить список всех доступных ID компонентов
 * @returns {string[]} - массив ID компонентов
 */
export function getAllComponentIds() {
  return Object.keys(COMPONENT_REGISTRY);
}

/**
 * Прикрепить компоненты к дереву навигации по ID
 * @param {Object} navTree - дерево навигации
 * @returns {Object} - дерево с прикрепленными компонентами
 */
export function attachComponentsToTree(navTree) {
  if (!navTree) return null;

  // Создаем копию дерева, чтобы не мутировать оригинал
  const treeWithComponents = JSON.parse(JSON.stringify(navTree));

  function assignComponents(node) {
    // Прикрепляем компонент по ID
    if (node.id && hasComponent(node.id)) {
      node.component = getComponentById(node.id);
    }

    // Рекурсивно обрабатываем дочерние элементы
    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(assignComponents);
    }
  }

  assignComponents(treeWithComponents);
  return treeWithComponents;
}
