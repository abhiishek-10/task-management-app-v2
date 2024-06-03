import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import styles from "./taskInputArea.module.css";
import {
  addTask,
  clearTaskToEdit,
  editTask,
  ITask,
} from "../../features/task/taskSlice";
import { AppDispatch, RootState } from "../../app/store";
import { nanoid } from "@reduxjs/toolkit";

const TaskInputArea = () => {
  const [taskName, setTaskName] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const [status, setStatus] = useState<string>("Todo");
  const formRef = useRef(null);

  const dispatch = useDispatch<AppDispatch>();

  // brought value of the task to the form inputs (On edit button press)
  const taskToEdit = useSelector((state: RootState) => state.task.taskToEdit);
  useEffect(() => {
    if (taskToEdit) {
      setTaskName(taskToEdit.title);
      setTaskDescription(taskToEdit.description);
      setSelected(new Date(taskToEdit.dueDate));
    }
  }, [taskToEdit]);

  const handleReset = () => {
    if (formRef.current) {
      (formRef.current as HTMLFormElement).reset();
    }
  };
  const addTaskHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!taskName || !taskDescription || !selected) return;
    const task: ITask = {
      _id: taskToEdit ? taskToEdit._id : nanoid(),
      title: taskName,
      description: taskDescription,
      dueDate: selected.toUTCString(),
      status: status,
    };
    if (taskToEdit) {
      dispatch(editTask(task));
      dispatch(clearTaskToEdit());
    } else {
      dispatch(addTask(task));
    }
    setTaskName("");
    setTaskDescription("");
    setSelected(new Date());
    setStatus("Todo");
    handleReset();
  };

  return (
    <form ref={formRef} onSubmit={addTaskHandler}>
      <div className={styles.inputArea}>
        <div className={styles.inputGroup}>
          <FloatingLabel
            controlId="floatingInput"
            label="Task Name"
            className={` ${styles.label}`}
          >
            <Form.Control
              type="text"
              className={styles.input}
              placeholder="Go buy milk"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            controlId="floatingTextarea2"
            className={styles.label}
            label="Task Description"
          >
            <Form.Control
              as="textarea"
              placeholder="Please buy 2% milk from the store."
              style={{ height: "100px" }}
              className={styles.input}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </FloatingLabel>
          <Form.Select
            aria-label="Status"
            defaultValue="Todo"
            onChange={(e) => {
              setStatus(e.target.value);
            }}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Form.Select>
        </div>
        <DayPicker
          mode="single"
          required
          selected={selected}
          onSelect={setSelected}
          disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
        />
      </div>
      <button className="common-btn mt-3" type="submit">
        {taskToEdit ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default TaskInputArea;
