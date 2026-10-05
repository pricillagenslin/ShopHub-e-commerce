import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  loginPromptOpen: boolean;
  loginPromptMessage?: string;
}

const initialState: UiState = {
  loginPromptOpen: false,
  loginPromptMessage: undefined,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showLoginPrompt(s, a: { payload?: string }) {
      s.loginPromptOpen = true;
      s.loginPromptMessage = a.payload;
    },
    hideLoginPrompt(s) {
      s.loginPromptOpen = false;
      s.loginPromptMessage = undefined;
    },
  },
});

export const { showLoginPrompt, hideLoginPrompt } = uiSlice.actions;
export default uiSlice.reducer;