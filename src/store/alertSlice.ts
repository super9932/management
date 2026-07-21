import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

export interface AlertPopPayload {
  title: string;
  content: string;
  /** 개행(\n)을 그대로 렌더링할지 여부 */
  preLine?: boolean;
  /** 팝업을 닫을 때 실행 — 세션 만료 시 로그인 페이지 이동 등에 쓴다 */
  closeCallback?: () => void;
}

interface AlertState extends AlertPopPayload {
  open: boolean;
}

const initialState: AlertState = {
  open: false,
  title: '',
  content: '',
  preLine: false,
  closeCallback: undefined,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlertPop(state, action: PayloadAction<AlertPopPayload>) {
      return { ...state, ...action.payload, open: true };
    },
    hideAlertPop() {
      return initialState;
    },
  },
});

export const { showAlertPop, hideAlertPop } = alertSlice.actions;
export default alertSlice.reducer;
