import { useContext } from "react";
import { ThreeBarsIcon, XIcon } from "@primer/octicons-react";
import { LayoutContext } from "../../context/ContextProvider";
import "./style.css";

const SidePanelToggle = () => {
  const { showSidePanel, setShowSidePanel } = useContext(LayoutContext);

  const handleOpenCategoryList = () => {
    setShowSidePanel(prevState => !prevState);
  };

  return (
    <div className="toggle-list-btn-container">
      <button
        type="button"
        onClick={handleOpenCategoryList}
        className="btn navbar-item toggle-list-btn theme-transition"
        title={showSidePanel ? "Hide side panel" : "Show side panel"}
        aria-label={showSidePanel ? "Hide side panel" : "Show side panel"}>
        {showSidePanel ? <XIcon size={16} /> : <ThreeBarsIcon size={16} />}
      </button>
    </div>
  );
};

export default SidePanelToggle;
