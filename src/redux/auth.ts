import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ISignIn } from "@/interfaces/AuthInterfaces";
import axios from "axios";
import config from "@/config";

export interface ISignUpInfo {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  password: string | null;
}

const axiosService = axios.create({
  baseURL: config.app.serverUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
export const login = createAsyncThunk(
  "auth/login",
  async (loginInfo: ISignIn, thunkAPI) => {
    const { data } = await axiosService.post("/login", loginInfo);
    return data;
  },
);

export const signup = createAsyncThunk(
  "auth/signup",
  async (signUpInfo: ISignUpInfo, thunkAPI) => {
    const { data } = await axiosService.post("/register", signUpInfo);
    return data;
  },
);

// Then, handle actions in your reducers:
const authSlice = createSlice({
  name: "auth",
  initialState: { token: null, id: null, loading: "idle" },
  reducers: {
    // standard reducer logic, with auto-generated action types per reducer
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: any) => {
      state.loading = "done";

      if (action.payload) {
        state.token = action.payload.token;
        state.id = action.payload.id;
      }
    });

    builder.addCase(signup.fulfilled, (state, action: any) => {
      state.loading = "done";

      if (action.payload) {
        state.token = action.payload.token;
        state.id = action.payload.id;
      }
    });
  },
});

export default authSlice.reducer;
