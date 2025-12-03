import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// State type definition
interface ApiState {
  data: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ApiState = {
  data: [],
  loading: false,
  error: null,
};

const apiSlice = createSlice({
  name: "api",
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
    },
    fetchSuccess: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.data = action.payload;
    },
    fetchError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    postSuccess: (state, action: PayloadAction<any>) => {
      state.data.push(action.payload);
    },
  },
});

export const { fetchStart, fetchSuccess, fetchError, postSuccess } =
  apiSlice.actions;

// GET request for fetching data
export const fetchData = () => async (dispatch: any) => {
  dispatch(fetchStart());
  try {
    const response = await axios.get("http://10.10.7.103:7010/api/v1");
    dispatch(fetchSuccess(response.data));
  } catch (error: any) {
    dispatch(fetchError(error.message || "Failed to fetch data"));
  }
};

// POST request for posting data
export const postData = (newData: any) => async (dispatch: any) => {
  try {
    const response = await axios.post("http://10.10.7.103:7010/api/v1", newData);
    dispatch(postSuccess(response.data));
  } catch (error: any) {
    console.error("Error posting data: ", error);
  }
};

export default apiSlice.reducer;
