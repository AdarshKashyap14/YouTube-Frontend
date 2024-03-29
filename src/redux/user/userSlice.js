import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentuser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentuser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signoutSuccess: (state) => {
        state.currentuser = null;
        state.error = null;
        state.loading = false;
      },
      updateStart: (state) => {
        state.loading = true;
        state.error = null;
      },
      updateSuccess: (state, action) => {
        state.currentuser = action.payload;
        state.loading = false;
        state.error = null;
      },
      updateFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
      },
  },
});

export const { signInStart, signInSuccess, signInFailure , signoutSuccess , updateFailure, updateStart , updateSuccess } = userSlice.actions;

export default userSlice.reducer;
