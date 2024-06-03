import { useEffect } from "react";
import TaskInputArea from "../taskInputArea/TaskInputArea";
import TaskShowcasePanel from "../taskShowcasePanel/TaskShowcasePanel";
import styles from "./mainPanel.module.css";
import { useNavigate } from "react-router-dom";

const MainPanel = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem("userToken") === null ||
      localStorage.getItem("userToken") === "" ||
      localStorage.getItem("userToken") === undefined
    ) {
      navigate("/");
    }
  }, []);


  return (
    <div className={` ${styles.mainPanelWrapper}`}>
      <div className={styles.mainPanel}>
        <TaskInputArea />
        <TaskShowcasePanel />
      </div>
    </div>
  );
};

export default MainPanel;
