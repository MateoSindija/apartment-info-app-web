import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";
import { IUserState } from "../interfaces/AuthInterfaces";

const initialState: IUserState = {
  id: undefined,
  type: undefined,
  token: undefined,
  apartmentId: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<any>) => {
      state.id = action.payload.id;
      state.type = action.payload.type;
      state.apartmentId = action.payload.apartmentId;
      state.token = action.payload.token;

      state ? console.log(state) : console.log("error");
    },
    setApartmentID: (state, action: PayloadAction<string>) => {
      state.apartmentId = action.payload;
    },
    logout: (state, action: PayloadAction<void>) => {
      state = { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(PURGE, (state) => {
      state.id = undefined;
      state.type = undefined;
      state.token = undefined;
      state.apartmentId = undefined;
      state ? console.log(state) : console.log("error");
    });
  },
});

// Action creators are generated for each case reducer function
export const { setUserData, setApartmentID, logout } = userSlice.actions;

export default userSlice.reducer;
