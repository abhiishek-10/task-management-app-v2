import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/authSlice";

export interface IUser {
  _id: string;
  username: string;
  avatar: string;
  bio: string;
  firstName: string;
  lastName: string;
  updatedAt: Date;
}

const initialState = {
  loading: false,
  error: "",
  user: null as IUser | null,
};

export const fetchUser = createAsyncThunk(
  "fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/profile/me`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response.status === 401) {
        logout();
      }
      if (!response.ok) {
        throw new Error("Failed to fetch user details");
      }
      const user = await response.json();

      return user;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "updateUser",
  async (
    fieldValues: {
      firstName: string;
      lastName: string;
      bio: string;
      avatar: string | File;
    },
    { rejectWithValue }
  ) => {
    const formData = new FormData();
    formData.append("firstName", fieldValues.firstName);
    formData.append("lastName", fieldValues.lastName);
    formData.append("bio", fieldValues.bio);
    formData.append("avatar", fieldValues.avatar);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/profile/edit-profile`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        logout();
      }
      if (!response.ok) {
        throw new Error("Failed to update user details");
      }
      const updatedUser = await response.json();

      return updatedUser;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // ======== fetch User ========
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      fetchUser.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // ======== update User ========
    builder.addCase(updateUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      updateUser.fulfilled,
      (state, action: PayloadAction<IUser>) => {
        state.loading = false;
        state.user = action.payload;
      }
    );
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default profileSlice.reducer;
