import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contentService from '../../services/contentService';

interface UpdateLivestockState {
  loading: boolean;
  error: string | null;
  success: any;
}

const initialState: UpdateLivestockState = {
  loading: false,
  error: null,
  success: {},
};

// export const updateLivestock = createAsyncThunk(
//   'livestock/updateLivestock',
//   async (data: any) => {
//     //console.log("data-------------- ",data);

//     const response = await contentService.updateLiveStock(data);
//     return response;
//   }
// );

export const updateLivestock = createAsyncThunk(
  "livestock/updateLivestock'",
  async (
    {
      payload,
      headers,
    }: {
      payload: { payload: any };
      headers?: Record<string, string>;
    },
    { rejectWithValue },
  ) => {
    //console.log("payload------------------ ",payload);

    try {
      const response = await contentService.updateLiveStock(payload, headers);
      return response;
    } catch (error: any) {
      //console.log("error------------------ ",error);

      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const updateLivestockSlice = createSlice({
  name: 'updateLivestock',
  initialState,
  reducers: {
    resetUpdateLivestockState: state => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateLivestock.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateLivestock.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action;
      })
      .addCase(updateLivestock.rejected, (state, action) => {
        state.loading = false;
        //console.log("action.error",action.error);

        state.error = action.error.message || 'Failed to update livestock';
      });
  },
});

export const { resetUpdateLivestockState } = updateLivestockSlice.actions;
export default updateLivestockSlice.reducer;
