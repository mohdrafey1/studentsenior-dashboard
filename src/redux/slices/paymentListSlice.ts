import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface User {
    _id: string;
    username: string;
    email: string;
}

interface Payment {
    _id: string;
    user: User;
    typeOfPurchase: string;
    purchaseItemId: string;
    merchantOrderId: string;
    amount: number;
    status: string;
    currency: string;
    provider: string;
    redirectBackUrl: string;
    createdAt: string;
    phonePeOrderId: string;
    paymentResponse: {
        orderId: string;
        state: string;
        amount: number;
        paymentDetails: Array<{
            transactionId: string;
            paymentMode: string;
            amount: number;
            state: string;
            rail: {
                type: string;
                utr: string;
                upiTransactionId: string;
            };
        }>;
    };
}

interface PaymentState {
    payments: Payment[];
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    payments: [],
    loading: false,
    error: null,
};

// Async Thunk for fetching payments
export const fetchPayments = createAsyncThunk<
    Payment[],
    void,
    { rejectValue: string }
>('payments/fetch', async (_, { rejectWithValue }) => {
    try {
        const token =
            typeof window !== 'undefined'
                ? localStorage.getItem('token')
                : null;
        const res = await fetch(api.transactions.payments, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch payments');
        }

        return (await res.json()) as Payment[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Redux Slice
const paymentListSlice = createSlice({
    name: 'paymentList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.payments = action.payload;
                state.loading = false;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch payments';
            });
    },
});

export const selectPayments = (state: RootState) => state.paymentList;
export default paymentListSlice.reducer;
