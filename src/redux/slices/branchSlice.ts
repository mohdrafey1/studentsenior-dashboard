import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

export interface Course {
    _id: string;
    courseName: string;
    courseCode: string;
}

export interface Branch {
    _id: string;
    branchName: string;
    branchCode: string;
    course: Course | null;
    totalSubject: number;
    totalSenior: number;
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

interface BranchState {
    branches: Branch[];
    loading: boolean;
    error: string | null;
}

const initialState: BranchState = {
    branches: [],
    loading: false,
    error: null,
};

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk to Fetch Branches
export const fetchBranches = createAsyncThunk<
    Branch[],
    void,
    { rejectValue: string }
>('branches/fetchBranches', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.branches);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch branches');
        }
        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Add Branch
export const addBranch = createAsyncThunk<
    Branch,
    Omit<
        Branch,
        | '_id'
        | 'totalSubject'
        | 'totalSenior'
        | 'totalNotes'
        | 'totalPyqs'
        | 'clickCounts'
        | 'createdAt'
    >,
    { rejectValue: string }
>('branches/addBranch', async (branchData, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.branches, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(branchData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add branch');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Update Branch
export const updateBranch = createAsyncThunk<
    Branch,
    { id: string; branchData: Partial<Omit<Branch, 'course'>> },
    { rejectValue: string }
>('branches/updateBranch', async ({ id, branchData }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.resource.branches}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(branchData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update branch');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Delete Branch
export const deleteBranch = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('branches/deleteBranch', async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.resource.branches}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete branch');
        }

        return id;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Branches Slice
const branchSlice = createSlice({
    name: 'branches',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.branches = action.payload;
                state.loading = false;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch branches';
            })
            .addCase(addBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addBranch.fulfilled, (state, action) => {
                state.branches.push(action.payload);
                state.loading = false;
            })
            .addCase(addBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add branch';
            })
            .addCase(updateBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBranch.fulfilled, (state, action) => {
                const index = state.branches.findIndex(
                    (branch) => branch._id === action.payload._id
                );
                if (index !== -1) {
                    state.branches[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update branch';
            })
            .addCase(deleteBranch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteBranch.fulfilled, (state, action) => {
                state.branches = state.branches.filter(
                    (branch) => branch._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteBranch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete branch';
            });
    },
});

export const selectBranches = (state: RootState) => state.branches;
export default branchSlice.reducer;
