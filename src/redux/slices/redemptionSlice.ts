// Redux Slice for Redemption Requests
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface Owner {
    _id: string;
    username: string;
    email: string;
}

interface RedemptionRequest {
    _id: string;
    upiId: string;
    rewardBalance: number;
    status: boolean;
    owner: Owner;
    createdAt: string;
}

interface RedemptionState {
    requests: RedemptionRequest[];
    loading: boolean;
    error: string | null;
}

const initialState: RedemptionState = {
    requests: [],
    loading: false,
    error: null,
};

export const fetchRedemptionRequests = createAsyncThunk<
    RedemptionRequest[],
    void,
    { rejectValue: string }
>('redemption/fetchRequests', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.transactions.redemption, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.message || 'Failed to fetch redemption requests'
            );
        }
        return (await res.json()) as RedemptionRequest[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

const redemptionSlice = createSlice({
    name: 'redemption',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRedemptionRequests.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRedemptionRequests.fulfilled, (state, action) => {
                state.requests = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchRedemptionRequests.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || 'Failed to fetch redemption requests';
            });
    },
});

export const selectRedemption = (state: RootState) => state.redemption;
export default redemptionSlice.reducer;
