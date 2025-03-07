import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface CollegeData {
    totalPYQs: number;
    totalNotes: number;
    totalSeniors: number;
    totalProduct: number;
    totalPost: number;
    totalRequestedPyqs: number;
    totalNewPyqs: number;
    totalLostFound: number;
    totalGroups: number;
    totalGiveOpportunity: number;
}

interface CollegeState {
    data: CollegeData | null;
    previousData: CollegeData | null;
    loading: boolean;
    error: string | null;
}

const initialState: CollegeState = {
    data: null,
    previousData: null,
    loading: false,
    error: null,
};

// Fetch college data
export const fetchCollegeData = createAsyncThunk<
    CollegeData,
    string,
    { rejectValue: string }
>('college/fetchCollegeData', async (collegeName, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.college.collegeData}/${collegeName}`);
        if (!res.ok) throw new Error('Failed to fetch data');
        return (await res.json()) as CollegeData;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

const collegeDataSlice = createSlice({
    name: 'collegeData',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCollegeData.pending, (state) => {
                state.loading = true;
            })
            .addCase(
                fetchCollegeData.fulfilled,
                (state, action: PayloadAction<CollegeData>) => {
                    state.previousData = state.data;
                    state.data = action.payload;
                    state.loading = false;
                    state.error = null;
                }
            )
            .addCase(fetchCollegeData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch data';
            });
    },
});

export const selectCollegeData = (state: RootState) => state.collegeData;
export default collegeDataSlice.reducer;
