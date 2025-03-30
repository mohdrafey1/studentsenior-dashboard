import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import collegeDataReducer from './slices/collegeDataSlice';
import reportStatsReducer from './slices/reportStatsSlice';
import collegesReducer from './slices/collegesSlice';
import addPointsReducer from './slices/addPointSlice';
import redemptionReducer from './slices/redemptionSlice';
import transactionsReducer from './slices/transactionsSlice';
import usersReducer from './slices/usersSlice';
import dashboardUsersReducer from './slices/dashboardUsersSlice';
import subjectReducer from './slices/subjectSlice';
import paymentsReducer from './slices/paymentListSlice';

// Noop storage to avoid server-side errors in SSR
const noopStorage = {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
};

// Common storage config
const persistConfig = {
    key: 'root',
    storage: typeof window !== 'undefined' ? storage : noopStorage,
    whitelist: [
        'auth',
        'collegeData',
        'reportStats',
        'colleges',

        'redemption',
        'users',
        'dashboardUsers',
        'transactions',

        'paymentList',
    ],
};

// Combine reducers before persisting
const rootReducer = combineReducers({
    auth: authReducer,
    collegeData: collegeDataReducer,
    reportStats: reportStatsReducer,
    colleges: collegesReducer,
    addPoints: addPointsReducer,
    redemption: redemptionReducer,
    transactions: transactionsReducer,
    users: usersReducer,
    dashboardUsers: dashboardUsersReducer,
    subjects: subjectReducer,
    paymentList: paymentsReducer,
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
