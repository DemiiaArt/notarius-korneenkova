import { useModal } from "@components/ModalProvider/ModalProvider";
import "./LeadsButton.scss";

const LeadsButton = () => {
  const { open } = useModal();

  return (
    <div className="circle-button" onClick={() => open("freeConsult")}>
      Безкоштовна
      <br />
      консультація
    </div>
  );
};

export default LeadsButton;
