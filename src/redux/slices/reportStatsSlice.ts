import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface Report {
    totalClient: number;
    totalContactUs: number;
    totalAddPointRequest: number;
    totalDashboardUser: number;
    totalBranch: number;
    totalCourse: number;
    totalSubjects: number;
    totalTransactions: number;
    totalRedemptionRequest: number;
    totalAffiliateProduct: number;
}

interface ReportState {
    currentData: Report | null;
    previousData: Report | null;
    loading: boolean;
    error: string | null;
}

const initialState: ReportState = {
    currentData: null,
    previousData: null,
    loading: false,
    error: null,
};

// Fetch report stats
export const fetchReportStats = createAsyncThunk<
    Report,
    void,
    { rejectValue: string }
>('reportStats/fetchReportStats', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.report.stats);
        if (!res.ok) throw new Error('Failed to fetch data');
        return (await res.json()) as Report;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

const reportStatsSlice = createSlice({
    name: 'reportStats',
    initialState,
    reducers: {
        setReportData: (state, action: PayloadAction<Report>) => {
            state.previousData = state.currentData;
            state.currentData = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchReportStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchReportStats.fulfilled, (state, action) => {
                state.previousData = state.currentData;
                state.currentData = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchReportStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch report stats';
            });
    },
});

export const { setReportData } = reportStatsSlice.actions;
export const selectReportStats = (state: RootState) => state.reportStats;
export default reportStatsSlice.reducer;
