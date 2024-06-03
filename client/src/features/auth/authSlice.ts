import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IFormInput {
  email: string;
  password: string;
}

export const signup = createAsyncThunk(
  "signup",
  async (data: IFormInput, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const userData = await response.json();
      if (userData.token) {
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("username", data.email);
      } else {
        return undefined;
      }

      return userData.token;
    } catch (error) {
      return rejectWithValue(undefined);
    }
  }
);

export const login = createAsyncThunk(
  "login",
  async (data: IFormInput, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.email,
            password: data.password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();
      if (userData.token) {
        localStorage.setItem("userToken", userData.token);
        localStorage.setItem("username", data.email);
      } else {
        return undefined;
      }

      return userData.token;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_KEY}/auth/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      const logoutSuccess = await response.json();
      if (logoutSuccess) {
        localStorage.clear();
      }
      return logoutSuccess;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(signup.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default authSlice.reducer;
