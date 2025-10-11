import { useModal } from "@components/ModalProvider/ModalProvider";
import { useTranslation } from "@hooks/useTranslation";
import "./LeadsButton.scss";

const LeadsButton = () => {
  const { open } = useModal();
  const { t } = useTranslation("components.LeadsButton");

  const text = t("freeConsultation").split(" ");
  const firstLine = text.slice(0, -1).join(" ");
  const lastWord = text[text.length - 1];

  return (
    <div className="circle-button" onClick={() => open("freeConsult")}>
      {firstLine}
      <br />
      {lastWord}
    </div>
  );
};

export default LeadsButton;
