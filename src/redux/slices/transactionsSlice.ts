import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface Transaction {
    _id: string;
    user: User;
    type: string;
    points: number;
    resourceType: string;
    resourceId: string;
    createdAt: string;
}

interface TransactionState {
    transactions: Transaction[];
    loading: boolean;
    error: string | null;
}

const initialState: TransactionState = {
    transactions: [],
    loading: false,
    error: null,
};

// Async Thunk for fetching transactions
export const fetchTransactions = createAsyncThunk<
    Transaction[],
    void,
    { rejectValue: string }
>('transactions/fetch', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.transactions.transaction, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.message || 'Failed to fetch transactions'
            );
        }

        return (await res.json()) as Transaction[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Redux Slice
const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.transactions = action.payload;
                state.loading = false;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch transactions';
            });
    },
});

export const selectTransactions = (state: RootState) => state.transactions;
export default transactionsSlice.reducer;
