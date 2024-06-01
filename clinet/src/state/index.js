import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  userId: "661b7cb9c4b2858aae19ff2c",
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { setMode } = globalSlice.actions;

export default globalSlice.reducer;