import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface College {
    _id: string;
    name: string;
    description: string;
    location: string;
    slug: string;
    status: boolean;
}

interface CollegeState {
    colleges: College[];
    loading: boolean;
    error: string | null;
}

const initialState: CollegeState = {
    colleges: [],
    loading: false,
    error: null,
};

// Fetch colleges
export const fetchColleges = createAsyncThunk<
    College[],
    void,
    { rejectValue: string }
>('colleges/fetchColleges', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.college.getColleges);
        if (!res.ok) throw new Error('Failed to fetch colleges');
        return (await res.json()) as College[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

const collegeSlice = createSlice({
    name: 'colleges',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchColleges.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchColleges.fulfilled, (state, action) => {
                state.colleges = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchColleges.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch colleges';
            });
    },
});

export const selectColleges = (state: RootState) => state.colleges;
export default collegeSlice.reducer;
