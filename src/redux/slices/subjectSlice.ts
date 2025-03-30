import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

export interface Branch {
    _id: string;
    branchName: string;
    branchCode: string;
}

export interface Subject {
    _id: string;
    subjectName: string;
    subjectCode: string;
    semester: string | number;
    branch: Branch | null;
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

interface SubjectState {
    subjects: Subject[];
    loading: boolean;
    error: string | null;
}

const initialState: SubjectState = {
    subjects: [],
    loading: false,
    error: null,
};

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk to Fetch Subjects
export const fetchSubjects = createAsyncThunk<
    Subject[],
    void,
    { rejectValue: string }
>('subjects/fetchSubjects', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.subjects);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch subjects');
        }
        const data = await res.json();
        return data.map((subject: Subject) => ({
            ...subject,
            semester: subject.semester.toString(),
        }));
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Add Subject
export const addSubject = createAsyncThunk<
    Subject,
    Omit<
        Subject,
        '_id' | 'totalNotes' | 'totalPyqs' | 'clickCounts' | 'createdAt'
    >,
    { rejectValue: string }
>('subjects/addSubject', async (subjectData, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.subjects, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...subjectData,
                semester: subjectData.semester.toString(),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add subject');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Update Subject
// Update the updateSubject thunk to make branch optional
export const updateSubject = createAsyncThunk<
    Subject,
    { id: string; subjectData: Partial<Omit<Subject, 'branch'>> },
    { rejectValue: string }
>(
    'subjects/updateSubject',
    async ({ id, subjectData }, { rejectWithValue }) => {
        try {
            const res = await fetch(`${api.resource.subjects}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(subjectData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(
                    errorData.message || 'Failed to update subject'
                );
            }

            return await res.json();
        } catch (error) {
            return rejectWithValue(
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred'
            );
        }
    }
);
// Async Thunk to Delete Subject
export const deleteSubject = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('subjects/deleteSubject', async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.resource.subjects}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete subject');
        }

        return id;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Subjects Slice
const subjectSlice = createSlice({
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
                state.error = action.payload || 'Failed to fetch subjects';
            })
            .addCase(addSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addSubject.fulfilled, (state, action) => {
                state.subjects.push(action.payload);
                state.loading = false;
            })
            .addCase(addSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add subject';
            })
            .addCase(updateSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateSubject.fulfilled, (state, action) => {
                const index = state.subjects.findIndex(
                    (subject) => subject._id === action.payload._id
                );
                if (index !== -1) {
                    state.subjects[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update subject';
            })
            .addCase(deleteSubject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.subjects = state.subjects.filter(
                    (subject) => subject._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete subject';
            });
    },
});

export const selectSubjects = (state: RootState) => state.subjects;
export default subjectSlice.reducer;
