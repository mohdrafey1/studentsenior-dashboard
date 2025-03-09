import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

interface Subject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: number;
    branch: {
        _id: string;
        branchName: string;
        branchCode: string;
    };
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

interface subjectState {
    subjects: Subject[];
    loading: boolean;
    error: string | null;
}

const initialState: subjectState = {
    subjects: [],
    loading: false,
    error: null,
};

// Async Thunk to Fetch dashboardUsers
export const fetchSubjects = createAsyncThunk<
    Subject[],
    void,
    { rejectValue: string }
>('subjects/fetchSubjects', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.subjects);

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch Subjects');
        }

        return (await res.json()) as Subject[];
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// dashboardUsers Slice
const SubjectSlice = createSlice({
    name: 'subjects',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.subjects = action.payload;
                state.loading = false;
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading = false;
                state.error =
                    action.payload || 'Failed to fetch dashboardUsers';
            });
    },
});

export const selectSubjects = (state: RootState) => state.subjects;
export default SubjectSlice.reducer;
