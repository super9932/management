import { configureStore } from '@reduxjs/toolkit';

import alertReducer from './alertSlice';
import tokenReducer from './tokenSlice';

export const store = configureStore({
  reducer: {
    token: tokenReducer,
    alert: alertReducer,
  },
  // showAlertPop의 closeCallback이 함수라서 직렬화 검사를 끈다.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export * from './tokenSlice';
export * from './alertSlice';
