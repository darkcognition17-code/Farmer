import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';
import authService, {
  DeleteLivestockResponse,
} from '../../services/authService'; // Import authService and types
import { LivestockTypesResponse } from '../../services/contentService';

interface LivestockState {
  data: LivestockTypesResponse | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const initialState: LivestockState = {
  data: null,
  loading: false,
  loadingMore: false,
  error: null,
};

export const fetchLivestock = createAsyncThunk(
  'livestock/fetchLivestock',
  async ({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }) => {
    const response = await contentService.getLiveStock(
      { page, limit },
    );
    return { ...response, page };
  },
);

export const deleteLivestock = createAsyncThunk<
  DeleteLivestockResponse, // Return type of the thunk's payload
  string, // First argument to the thunk (livestockRecordId)
  { rejectValue: string } // Optional: type for the rejectValue
>(
  'livestock/deleteLivestock',
  async (livestockRecordId: string, { rejectWithValue }) => {
    try {
      const response = await authService.deleteLivestock(livestockRecordId);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete livestock',
      );
    }
  },
);

const livestockSlice = createSlice({
  name: 'livestock',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchLivestock.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchLivestock.fulfilled, (state, action) => {
        if (action.payload.page === 1) {
          state.data = action.payload;
        } else {
          if (state.data) {
            state.data.data.livestock.push(...action.payload.data.livestock);
            state.data.data.pagination = action.payload.data.pagination;
          }
        }
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchLivestock.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.error.message || 'Failed to fetch livestock data';
      })
      .addCase(deleteLivestock.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Optionally, update the state by removing the deleted item if the data is stored in the slice
        // For now, we assume the UI will refetch or navigate
      })
      .addCase(deleteLivestock.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || 'Failed to delete livestock';
      });
  },
});

export default livestockSlice.reducer;
