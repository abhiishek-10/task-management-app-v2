import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";

export interface ITask {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
}
interface TaskState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
  taskToEdit: ITask | null;
}
const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  taskToEdit: null,
};

function logoutUser() {
  logout();
  
}

export const addTask = createAsyncThunk(
  "addTask",
  async (task: Omit<ITask, "id">, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
        }),
      });

      if (!response.ok) {
        throw new Error("Task creation failed");
      }
      const taskData = await response.json();

      return taskData;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const fetchTasks = createAsyncThunk(
  "fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_KEY}/tasks`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });

      if (response.status === 401) {
        logoutUser();
      }
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      const tasks = await response.json();
      return tasks;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  "deleteTask",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      await response.json();
      return taskId;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const editTask = createAsyncThunk(
  "editTask",
  async (updatedTask: ITask, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/tasks/${updatedTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            dueDate: updatedTask.dueDate,
            status: updatedTask.status,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const tasks = await response.json();

      return tasks;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTaskToEdit: (state, action: PayloadAction<ITask>) => {
      state.taskToEdit = action.payload;
    },
    clearTaskToEdit: (state) => {
      state.taskToEdit = null;
    },
  },
  extraReducers(builder) {
    // ======== add Task ========
    builder.addCase(addTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      addTask.fulfilled,
      (state, action: PayloadAction<ITask>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      }
    );
    builder.addCase(addTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ======== fetch Tasks ========
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchTasks.fulfilled,
      (state, action: PayloadAction<ITask[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      }
    );
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ======== delete Tasks ========
    builder.addCase(deleteTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
    });
    builder.addCase(deleteTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ======== edit Tasks ========
    builder.addCase(editTask.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(editTask.fulfilled, (state, action) => {
      state.loading = false;
      const updatedTask = action.payload;
      const existingTask = state.tasks.find(
        (task) => task._id === updatedTask._id
      );
      if (existingTask) {
        existingTask.title = updatedTask.title;
        existingTask.description = updatedTask.description;
        existingTask.dueDate = updatedTask.dueDate;
        existingTask.status = updatedTask.status;
      }
    });
    builder.addCase(editTask.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setTaskToEdit, clearTaskToEdit } = taskSlice.actions;

export default taskSlice.reducer;
