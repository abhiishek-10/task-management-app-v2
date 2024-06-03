import { useDispatch, useSelector } from "react-redux";
import SingleTask from "../singleTask/SingleTask";
import styles from "./taskShowcasePanel.module.css";
import { AppDispatch, RootState } from "../../app/store";
import { useEffect } from "react";
import {
  deleteTask,
  fetchTasks,
  setTaskToEdit,
} from "../../features/task/taskSlice";

const TaskShowcasePanel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { tasks, loading } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const handleEdit = (taskId: string) => {
    const task = tasks.find((task) => task._id === taskId);
    if (task) {
      dispatch(setTaskToEdit(task));
    }
  };

  return (
    <div className="mt-5">
      <h5 className="text-accent mb-3 ms-3">Your Tasks</h5>
      <div className={`mt-3 ${styles.taskShowcasePanel}`}>
        {loading ? (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        ) : (
          <div className={styles.taskList}>
            {tasks.length === 0 ? (
              <h3>No tasks found.</h3>
            ) : (
              tasks.map((task) => (
                <div key={task._id}>
                  <SingleTask
                    taskId={task._id}
                    taskName={task.title}
                    taskDescription={task.description}
                    dueDate={task.dueDate}
                    taskStatus={task.status}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskShowcasePanel;
