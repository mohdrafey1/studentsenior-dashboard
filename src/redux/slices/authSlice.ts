import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    isAuthenticated:
        typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.token = action.payload;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload);
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Function to check token expiration
export const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('token_expiration');

    if (!token || !expiration) return false;

    if (Date.now() > parseInt(expiration)) {
        localStorage.removeItem('token');
        localStorage.removeItem('token_expiration');
        return false;
    }

    return true;
};
