import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

const ACCESS_TOKEN_KEY = 'accessToken';

interface TokenState {
  accessToken: string;
}

/** 새로고침해도 토큰이 유지되도록 초기값을 localStorage에서 복원한다. */
const initialState: TokenState = {
  accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) ?? '',
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    saveAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      localStorage.setItem(ACCESS_TOKEN_KEY, action.payload);
    },
    clearAccessToken(state) {
      state.accessToken = '';
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
  },
});

export const { saveAccessToken, clearAccessToken } = tokenSlice.actions;
export default tokenSlice.reducer;
