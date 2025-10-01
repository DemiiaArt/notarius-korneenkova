// src/nav/attachComponents.js
import { lazy } from "react";
import { NAV_TREE } from "./nav-tree";

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

const Signature = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Signature/Signature")
);
const Applications = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Signature/Applications")
);

const Consultations = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Consultation/Consultations")
);
const DocumentCopies = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Consultation/DocumentCopies")
);

const ApostilleDocs = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Apostille/ApostilleDocs")
);
const Affidavit = lazy(
  () => import("@pagesSecondLevel/NotaryServices/Apostille/Affidavit")
);

// import GiftAgreement from "@pagesSecondLevel/NotaryServices/Contract/GiftAgreement";
// import LoanAgreement from "@pagesSecondLevel/NotaryServices/Contract/LoanAgreement";
// import ExchangeAgreement from "@pagesSecondLevel/NotaryServices/Contract/ExchangeAgreement";
// import LifetimeMaintenance from "@pagesSecondLevel/NotaryServices/Contract/LifetimeMaintenance";
// import RentRealtyLand from "@pagesSecondLevel/NotaryServices/Contract/RentRealtyLand";
// import MortgagePledge from "@pagesSecondLevel/NotaryServices/Contract/MortgagePledge";
// import DivisionCommonProperty from "@pagesSecondLevel/NotaryServices/Contract/DivisionCommonProperty";
// import MarriageContract from "@pagesSecondLevel/NotaryServices/Contract/MarriageContract";
// import SpousesPropertyDivision from "@pagesSecondLevel/NotaryServices/Contract/SpousesPropertyDivision";
// import ShareAllocationSpouses from "@pagesSecondLevel/NotaryServices/Contract/ShareAllocationSpouses";
// import TerminateMortgage from "@pagesSecondLevel/NotaryServices/Contract/TerminateMortgage";
// import SuretyAgreement from "@pagesSecondLevel/NotaryServices/Contract/SuretyAgreement";
// import FutureSaleObject from "@pagesSecondLevel/NotaryServices/Contract/FutureSaleObject";
// import InheritanceContracts from "@pagesSecondLevel/NotaryServices/Contract/InheritanceContracts";
// import WillSimple from "@pagesSecondLevel/NotaryServices/Contract/WillSimple";
// import WillWitnesses from "@pagesSecondLevel/NotaryServices/Contract/WillWitnesses";
// import SpousesJointWill from "@pagesSecondLevel/NotaryServices/Contract/SpousesJointWill";
// import RefuseInheritance from "@pagesSecondLevel/NotaryServices/Contract/RefuseInheritance";
// import DivisionInheritance from "@pagesSecondLevel/NotaryServices/Contract/DivisionInheritance";
// import CorporateRights from "@pagesSecondLevel/NotaryServices/Contract/CorporateRights";
// import SellShareLlc from "@pagesSecondLevel/NotaryServices/Contract/SellShareLlc";
// import GiftCorporateRights from "@pagesSecondLevel/NotaryServices/Contract/GiftCorporateRights";
// import CharterChanges from "@pagesSecondLevel/NotaryServices/Contract/CharterChanges";
// import ExecutiveInscription from "@pagesSecondLevel/NotaryServices/Contract/ExecutiveInscription";
// import ExecRentRealestate from "@pagesSecondLevel/NotaryServices/Contract/ExecRentRealestate";
// import ExecRentVehicle from "@pagesSecondLevel/NotaryServices/Contract/ExecRentVehicle";
// import OtherContractsGeneric from "@pagesSecondLevel/NotaryServices/Contract/OtherContractsGeneric";
// import CorporateRightsGeneric from "@pagesSecondLevel/NotaryServices/Contract/CorporateRightsGeneric";
// import PoaVehicleDisposal from "@pagesSecondLevel/NotaryServices/Attorney/PoaVehicleDisposal";
// import PoaRealEstateDisposal from "@pagesSecondLevel/NotaryServices/Attorney/PoaRealEstateDisposal";
// import PoaRepresentationVehicleUse from "@pagesSecondLevel/NotaryServices/Attorney/PoaRepresentationVehicleUse";
// import PoaMovableFunds from "@pagesSecondLevel/NotaryServices/Attorney/PoaMovableFunds";
// import PoaCombined from "@pagesSecondLevel/NotaryServices/Attorney/PoaCombined";
// import PoaBilingual from "@pagesSecondLevel/NotaryServices/Attorney/PoaBilingual";
// import PoaRevocation from "@pagesSecondLevel/NotaryServices/Attorney/PoaRevocation";
// import ConsentSpouseChildTravel from "@pagesSecondLevel/NotaryServices/Signature/ConsentSpouseChildTravel";
// import SignatureBankCards from "@pagesSecondLevel/NotaryServices/Signature/SignatureBankCards";
// import SignatureCharterProtocol from "@pagesSecondLevel/NotaryServices/Signature/SignatureCharterProtocol";
// import ExitParticipantLlc from "@pagesSecondLevel/NotaryServices/Signature/ExitParticipantLlc";
// import StatementsBilingual from "@pagesSecondLevel/NotaryServices/Signature/StatementsBilingual";
// import NotarialConsultation from "@pagesSecondLevel/NotaryServices/Consultation/NotarialConsultation";
// import CopyUpTo4pp from "@pagesSecondLevel/NotaryServices/Consultation/CopyUpTo4pp";
// import CopyMultipagePerPage from "@pagesSecondLevel/NotaryServices/Consultation/CopyMultipagePerPage";
// import DuplicateDocs from "@pagesSecondLevel/NotaryServices/Consultation/DuplicateDocs";
// import DuplicatesCertificatesonsult from "@pagesSecondLevel/NotaryServices/Consultation/DuplicatesCertificatesonsult";
// import ApostilleAnyDocs from "@pagesSecondLevel/NotaryServices/Apostille/ApostilleAnyDocs";
// import AffidavitPerson from "@pagesSecondLevel/NotaryServices/Apostille/AffidavitPerson";
// import AffidavitTranslator from "@pagesSecondLevel/NotaryServices/Apostille/AffidavitTranslator";
// import TranslatorSignature from "@pagesSecondLevel/NotaryTranslate/TranslatorSignature";
// import NotarialTranslationOneDoc from "@pagesSecondLevel/NotaryTranslate/NotarialTranslationOneDoc";
// import TwoInOneCopyTranslation from "@pagesSecondLevel/NotaryTranslate/TwoInOneCopyTranslation";
// import LegalConsultationsWithOpinion from "@pagesSecondLevel/OtherServices/LegalConsultationsWithOpinion";
// import ExtractsRealRightsRegister from "@pagesSecondLevel/OtherServices/ExtractsRealRightsRegister";
// import EdrRegistration from "@pagesSecondLevel/OtherServices/EdrRegistration";
// import RegisterOwnershipRealEstate from "@pagesSecondLevel/OtherServices/RegisterOwnershipRealEstate";
// import EdrErrorCorrection from "@pagesSecondLevel/OtherServices/EdrErrorCorrection";
// import RightsRegisterForDevelopers from "@pagesSecondLevel/OtherServices/RightsRegisterForDevelopers";

// ...и т.д.

const components = {
  home: MainPage,
  about: AboutPage,
  services: ServicesPage, // если есть страница раздела
  "notary-translate": NotaryTranslatePage,
  "military-help": MilitaryPage,
  "other-services": OtherServicesPage,
  offer: OfferPage,
  policy: PolicyPage,
  contacts: ContactsPage,
  trademark: TradeMarkPage,
  blog: MainBlogPage,
  contracts: ContractPage,
  "property-agreements": PropertyAgreements,
  "family-agreements": FamilyAgreements,
  "contractual-guarantees": ContractualGuarantees,
  "inheritance-agreements": InheritanceAgreements,
  "corporate-rights-agreements": CorporateRightsAgreements,
  "executive-inscription": ExecutiveInscription,
  "other-agreements": OtherAgreements,
  // "gift-agreement": GiftAgreement,
  // "loan-agreement": LoanAgreement,
  // "exchange-agreement": ExchangeAgreement,
  // "lifetime-maintenance": LifetimeMaintenance,
  // "rent-realty-land": RentRealtyLand,
  // "mortgage-pledge": MortgagePledge,
  // "division-common-property": DivisionCommonProperty,
  // "marriage-contract": MarriageContract,
  // "spouses-property-division": SpousesPropertyDivision,
  // "share-allocation-spouses": ShareAllocationSpouses,
  // "terminate-mortgage": TerminateMortgage,
  // "surety-agreement": SuretyAgreement,
  // "future-sale-object": FutureSaleObject,
  // "inheritance-contracts": InheritanceContracts,
  // "will-simple": WillSimple,
  // "will-witnesses": WillWitnesses,
  // "spouses-joint-will": SpousesJointWill,
  // "refuse-inheritance": RefuseInheritance,
  // "division-inheritance": DivisionInheritance,
  // "corporate-rights": CorporateRights,
  // "sell-share-llc": SellShareLlc,
  // "gift-corporate-rights": GiftCorporateRights,
  // "charter-changes": CharterChanges,
  // "executive-inscription": ExecutiveInscription,
  // "exec-rent-realestate": ExecRentRealestate,
  // "exec-rent-vehicle": ExecRentVehicle,
  // "corporate-rights-generic": CorporateRightsGeneric,
  "power-of-attorney": AttorneyPage,
  "poa-property": PoaProperty,
  "poa-representation": PoaRepresentation,
  "poa-special": PoaSpecial,
  // "poa-movable-funds": PoaMovableFunds,
  // "poa-combined": PoaCombined,
  // "poa-bilingual": PoaBilingual,
  // "poa-revocation": PoaRevocation,
  "signatures-statements": SignaturePage,
  // "consent-spouse-child-travel": ConsentSpouseChildTravel,
  "signatures-consents": Signature,
  applications: Applications,
  // "signature-bank-cards": SignatureBankCards,
  // "signature-charter-protocol": SignatureCharterProtocol,
  // "exit-participant-llc": ExitParticipantLlc,
  // "statements-bilingual": StatementsBilingual,
  "consult-copy-duplicate": ConsultationPage,
  consultations: Consultations,
  "document-copies": DocumentCopies,
  // "notarial-consultation": NotarialConsultation,
  // "copy-up-to-4pp": CopyUpTo4pp,
  // "copy-multipage-per-page": CopyMultipagePerPage,
  // "duplicate-docs": DuplicateDocs,
  // "duplicates-certificates-consult": DuplicatesCertificatesonsult,
  "apostille-affidavit": ApostillePage,
  "apostille-docs": ApostilleDocs,
  affidavit: Affidavit,
  // "apostille-any-docs": ApostilleAnyDocs,
  // "affidavit-person": AffidavitPerson,
  // "affidavit-translator": AffidavitTranslator,

  // "translator-signature": TranslatorSignature,
  // "notarial-translation-one-doc": NotarialTranslationOneDoc,
  // "two-in-one-copy-translation": TwoInOneCopyTranslation,

  // "legal-consultations-with-opinion": LegalConsultationsWithOpinion,
  // "extracts-real-rights-register": ExtractsRealRightsRegister,
  // "edr-registration": EdrRegistration,
  // "register-ownership-real-estate": RegisterOwnershipRealEstate,
  // "edr-error-correction": EdrErrorCorrection,
  // "rights-register-for-developers": RightsRegisterForDevelopers,
};

function assign(node) {
  if (components[node.id]) node.component = components[node.id];
  node.children?.forEach(assign);
}
assign(NAV_TREE);
