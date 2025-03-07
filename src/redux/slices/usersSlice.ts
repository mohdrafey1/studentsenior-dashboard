import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture: string;
    college: string;
    phone: string;
    rewardBalance: number;
    rewardPoints: number;
    rewardRedeemed: number;
    createdAt: string;
}

interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UsersState = {
    users: [],
    loading: false,
    error: null,
};

// Async Thunk to Fetch Users
export const fetchUsers = createAsyncThunk<
    User[],
    void,
    { rejectValue: string }
>('users/fetch', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.user.allUser, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch users');
        }

        return (await res.json()) as User[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Users Slice
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch users';
            });
    },
});

export const selectUsers = (state: RootState) => state.users;
export default usersSlice.reducer;
