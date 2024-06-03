import { useState } from "react";
import styles from "./singleTask.module.css";
import { format } from "date-fns";

interface SingleTaskProps {
  taskId: string;
  taskName: string;
  taskDescription: string;
  dueDate: Date | string;
  taskStatus: string;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string) => void;
}
const SingleTask: React.FC<SingleTaskProps> = ({
  taskId,
  taskName,
  taskDescription,
  dueDate,
  taskStatus,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    onEdit(taskId);
  };

  const handleDeleteClick = () => {
    onDelete(taskId);
  };

  return (
    <div className={styles.task}>
      <div className={styles.taskDetails}>
        <div className={styles.taskName}>
          <p>{taskName}</p>
        </div>
        <div className={styles.taskDescription}>
          <p>{taskDescription}</p>
        </div>
      </div>
      <div className={styles.date}>
        <p>
          Due: <span>{format(dueDate, "PP")}</span>
        </p>
      </div>
      <div className={styles.taskStatus}>
        <p>
          Status: <span>{taskStatus}</span>
        </p>
      </div>
      <div className={styles.taskControl}>
        <button className="common-btn" onClick={handleEditClick}>
          Edit
        </button>
        <button
          className="common-btn"
          onClick={handleDeleteClick}
          disabled={isEditing}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default SingleTask;
