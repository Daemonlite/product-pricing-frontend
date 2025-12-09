import { configureStore } from '@reduxjs/toolkit';
import usersReducer from './slices/usersSlice';
import rolesReducer from './slices/rolesSlice';
import departmentsReducer from './slices/departmentsSlice';
import categoriesReducer from './slices/categoriesSlice';
import productsReducer from './slices/productsSlice';
import pricingReducer from './slices/pricingSlice';
import shippingsReducer from './slices/shippingsSlice';
import logsReducer from './slices/logsSlice';
import notificationsReducer from './slices/notificationsSlice';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    users: usersReducer,
    roles: rolesReducer,
    departments: departmentsReducer,
    categories: categoriesReducer,
    products: productsReducer,
    pricing: pricingReducer,
    shippings: shippingsReducer,
    logs: logsReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
