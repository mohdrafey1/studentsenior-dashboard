import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface Owner {
    _id: string;
    username: string;
    email: string;
}

interface AddPointRequest {
    _id: string;
    owner: Owner;
    pointsAdded: number;
    rupees: number;
    status: boolean;
    createdAt: string;
}

interface AddPointsState {
    requests: AddPointRequest[];
    loading: boolean;
    error: string | null;
}

const initialState: AddPointsState = {
    requests: [],
    loading: false,
    error: null,
};

export const fetchAddPointsRequests = createAsyncThunk<
    AddPointRequest[],
    void,
    { rejectValue: string }
>('addPoints/fetchRequests', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.transactions.addPoint, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.message || 'Failed to fetch add points requests'
            );
        }
        return (await res.json()) as AddPointRequest[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

const addPointsSlice = createSlice({
    name: 'addPoints',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddPointsRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAddPointsRequests.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchAddPointsRequests.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || 'Failed to fetch add points requests';
            });
    },
});

export const selectAddPoints = (state: RootState) => state.addPoints;
export default addPointsSlice.reducer;
