import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transcriptReducer from './slices/transcriptSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transcript: transcriptReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
  },
});

export default store;
