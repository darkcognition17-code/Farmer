import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LanguageState {
  current: string | null;
}

const initialState: LanguageState = {
  current: null,
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.current = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
