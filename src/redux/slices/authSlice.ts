import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    token: null,
    role: null,
    email: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            const { token, expirationTime, role, email } = action.payload;
            state.token = token;
            state.email = email;
            state.role = role;
            state.isAuthenticated = true;
            localStorage.setItem('token', token);
            localStorage.setItem('token_expiration', expirationTime);
        },
        logout: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            state.email = null;
            state.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('token_expiration');
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

// Function to check token expiration
export const checkTokenExpiration = () => {
    if (typeof window === 'undefined') return false;

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
