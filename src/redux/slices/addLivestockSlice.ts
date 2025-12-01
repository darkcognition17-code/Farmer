import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';

interface AddLivestockState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AddLivestockState = {
  loading: false,
  error: null,
  success: false,
};

export const addLivestock = createAsyncThunk(
  'livestock/addLivestock',
  async (
    { data, headers }: { data: any; headers?: Record<string, string> },
  ) => {
    const response = await contentService.addLiveStock(data, headers);
    return response;
  }
);

const addLivestockSlice = createSlice({
  name: 'addLivestock',
  initialState,
  reducers: {
    resetAddLivestockState: (state) => {
        state.loading = false;
        state.error = null;
        state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addLivestock.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addLivestock.fulfilled, (state,action) => {
        state.loading = false;
        state.success = action;
      })
      .addCase(addLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add livestock';
      });
  },
});

export const { resetAddLivestockState } = addLivestockSlice.actions;
export default addLivestockSlice.reducer;
