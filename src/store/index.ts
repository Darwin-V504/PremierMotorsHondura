import { configureStore } from "@reduxjs/toolkit";
import serviceReducer from './ServiceSlice';
import planReducer from './PlanSlice';

export const store = configureStore({
  reducer: {
    services: serviceReducer,
    plans: planReducer, // Verifica que esto esté bien
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;