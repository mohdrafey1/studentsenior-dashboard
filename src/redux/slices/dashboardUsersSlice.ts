import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface User {
    _id: string;
    username: string;
    email: string;
    college: string;
    role: string;
    createdAt: string;
}

interface dashboardUsersState {
    dashboardUsers: User[];
    loading: boolean;
    error: string | null;
}

const initialState: dashboardUsersState = {
    dashboardUsers: [],
    loading: false,
    error: null,
};

// Async Thunk to Fetch dashboardUsers
export const fetchdashboardUsers = createAsyncThunk<
    User[],
    void,
    { rejectValue: string }
>('dashboardUsers/fetchDashboardUsers', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.user.allDashboardUser, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.message || 'Failed to fetch dashboardUsers'
            );
        }

        return (await res.json()) as User[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// dashboardUsers Slice
const dashboardUserSlice = createSlice({
    name: 'dashboardUsers',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchdashboardUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchdashboardUsers.fulfilled, (state, action) => {
                state.dashboardUsers = action.payload;
                state.loading = false;
            })
            .addCase(fetchdashboardUsers.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || 'Failed to fetch dashboardUsers';
            });
    },
});

export const selectdashboardUsers = (state: RootState) => state.dashboardUsers;
export default dashboardUserSlice.reducer;
