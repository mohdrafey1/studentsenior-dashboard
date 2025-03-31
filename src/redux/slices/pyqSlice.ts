import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

export interface Pyq {
    _id: string;
    subject: {
        _id: string;
        subjectName: string;
    };
    slug: string;
    fileUrl: string;
    year: string;
    examType: string;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    status: boolean;
    rewardPoints: number;
    clickCounts: number;
    solved: boolean;
    isPaid: boolean;
    price: number;
    purchasedBy: string[];
    createdAt: string;
}

interface PyqState {
    pyqs: Pyq[];
    loading: boolean;
    error: string | null;
}

const initialState: PyqState = {
    pyqs: [],
    loading: false,
    error: null,
};

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk to Fetch PYQs
export const fetchPyqs = createAsyncThunk<
    Pyq[],
    string,
    { rejectValue: string }
>('pyqs/fetchPyqs', async (collegeName, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.pyqs.getPyqs}/${collegeName}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch PYQs');
        }
        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Update PYQ
export const updatePyq = createAsyncThunk<
    Pyq,
    { id: string; pyqData: Partial<Pyq> },
    { rejectValue: string }
>('pyqs/updatePyq', async ({ id, pyqData }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.pyqs.getPyqs}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(pyqData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update PYQ');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Delete PYQ
export const deletePyq = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('pyqs/deletePyq', async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.pyqs.getPyqs}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete PYQ');
        }

        return id;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// PYQs Slice
const pyqSlice = createSlice({
    name: 'pyqs',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPyqs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPyqs.fulfilled, (state, action) => {
                state.pyqs = action.payload;
                state.loading = false;
            })
            .addCase(fetchPyqs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch PYQs';
            })
            .addCase(updatePyq.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePyq.fulfilled, (state, action) => {
                const index = state.pyqs.findIndex(
                    (pyq) => pyq._id === action.payload._id
                );
                if (index !== -1) {
                    state.pyqs[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updatePyq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update PYQ';
            })
            .addCase(deletePyq.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePyq.fulfilled, (state, action) => {
                state.pyqs = state.pyqs.filter(
                    (pyq) => pyq._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deletePyq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete PYQ';
            });
    },
});

export const selectPyqs = (state: RootState) => state.pyqs;
export default pyqSlice.reducer;
