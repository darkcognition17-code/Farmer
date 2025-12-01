import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';
import authService, { UpdateMachineryPayload, UpdateMachineryResponse } from '../../services/authService'; // Import authService and types
import { LivestockTypesResponse } from '../../services/contentService';

interface MachineryState {
  data: LivestockTypesResponse | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const initialState: MachineryState = {
  data: null,
  loading: false,
  loadingMore: false,
  error: null,
};

export const fetchMachinery = createAsyncThunk(
  'machinery/fetchMachinery',
  async ({ page, limit }: { page: number; limit: number }) => {
    const response = await contentService.getMachinery({ page, limit });
    return { ...response, page };
  }
);

export const addLivestock = createAsyncThunk(
  'livestock/addLivestock',
  async (data: any) => {
    const response = await contentService.addLiveStock(data);
    return response;
  }
);

export const updateMachinery = createAsyncThunk<
  UpdateMachineryResponse, // Return type of the thunk's payload
  { payload: UpdateMachineryPayload; headers?: Record<string, string> }, // First argument to the thunk (payload)
  { rejectValue: string } // Optional: type for the rejectValue
>(
  'machinery/updateMachinery',
  async ({ payload, headers }, { rejectWithValue }) => {
    try {
      const response = await authService.updateMachinery(payload, headers);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update machinery');
    }
  }
);

const machinerySlice = createSlice({
  name: 'machinery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
       .addCase(fetchMachinery.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchMachinery.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.data = action.payload;
        } else {
          if (state.data) {
            state.data.data.machinery.push(...action.payload.data.machinery);
            state.data.data.pagination = action.payload.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchMachinery.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Failed to fetch livestock data';
      })
      .addCase(updateMachinery.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMachinery.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally, update the state with the new machinery data if needed
        // For now, we assume the UI will refetch or navigate
      })
      .addCase(updateMachinery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to update machinery';
      });
  },
});

export default machinerySlice.reducer;
