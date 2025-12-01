import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import contentService, {
  StaticContentResponse,
} from '../../services/contentService';
import { endpoints } from '../../utils/endpoints';

//console.log('Executing contentSlice.ts');

interface ContentState {
  loading: boolean;
  staticContent: StaticContentResponse | null;
  error: string | null;
}

const initialState: ContentState = {
  loading: false,
  staticContent: null,
  error: null,
};

export const fetchStaticContent = createAsyncThunk(
  endpoints.content.getStaticContent,
  async (
    { slug, headers }: { slug: string; headers?: Record<string, string> },
    { rejectWithValue },
  ) => {
    //console.log('Fetching static content with:', { slug });
    try {
      const response = await contentService.getStaticContent(slug, headers);
      //console.log('API call successful:', response);
      return response;
    } catch (error: any) {
      console.error('API call failed:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchStaticContent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStaticContent.fulfilled,
        (state, action: PayloadAction<StaticContentResponse>) => {
          state.loading = false;
          state.staticContent = action.payload;
        },
      )
      .addCase(fetchStaticContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default contentSlice.reducer;
