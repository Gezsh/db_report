import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  report: null,
  loading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    submitReportStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    submitReportSuccess: (state, action) => {
      state.report = action.payload;
      state.loading = false;
    },
    submitReportFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearReport: (state) => {
      state.report = null;
      state.error = null;
    },
  },
});

export const { submitReportStart, submitReportSuccess, submitReportFailure, clearReport } = reportSlice.actions;
export default reportSlice.reducer;
