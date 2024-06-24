import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../rootReducer";

export interface IAcai {
  id: string;
  name: string;
  description: string;
  size: string;
  price: number;
  imageUrl: string;
}

export interface IAcaiState {
  acais: IAcai[];
  loading: boolean;
  error: string | null;
}

const initialState: IAcaiState = {
  acais: [],
  loading: false,
  error: null,
};

export const fetchAcais = createAsyncThunk("acai/fetchAcais", async () => {
  const response = await axios.get("http://localhost:3333/acai");
  return response.data;
});

export const createAcai = createAsyncThunk(
  "acai/createAcai",
  async (newAcai: Omit<IAcai, "id">) => {
    const response = await axios.post("http://localhost:3333/acai", newAcai);
    return response.data;
  }
);

export const acaiSlice = createSlice({
  name: "acai",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchAcais.pending, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(fetchAcais.fulfilled, (state, action) => {
        state.loading = false;
        state.acais = action.payload;
      })

      .addCase(fetchAcais.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch acais";
      })

      .addCase(createAcai.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createAcai.fulfilled, (state, action) => {
        state.loading = false;
        state.acais.push(action.payload);
      })

      .addCase(createAcai.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create acai";
      });
  },
});

export const selectAcais = (state: RootState) => state.acai.acais;
export const selectLoading = (state: RootState) => state.acai.loading;
export const selectError = (state: RootState) => state.acai.error;

export default acaiSlice.reducer;
