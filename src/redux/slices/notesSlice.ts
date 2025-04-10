import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

export interface Note {
    _id: string;
    subject: {
        _id: string;
        subjectName: string;
    };
    slug: string;
    title: string;
    fileUrl: string;
    description: string;
    owner: {
        _id: string;
        username: string;
    };
    college: string;
    status: boolean;
    likes: string[];
    rewardPoints: number;
    clickCounts: number;
    isPaid: boolean;
    price: number;
    purchasedBy: string[];
    createdAt: string;
    updatedAt: string;
}

interface NoteState {
    notes: Note[];
    loading: boolean;
    error: string | null;
}

const initialState: NoteState = {
    notes: [],
    loading: false,
    error: null,
};

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk to Fetch Notes
export const fetchNotes = createAsyncThunk<
    Note[],
    string,
    { rejectValue: string }
>('notes/fetchNotes', async (collegeName, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.notes.getNotes}/${collegeName}`);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch notes');
        }
        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Update Note
export const updateNote = createAsyncThunk<
    Note,
    { id: string; noteData: Partial<Note> },
    { rejectValue: string }
>('notes/updateNote', async ({ id, noteData }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.notes.getNotes}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(noteData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update note');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Delete Note
export const deleteNote = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('notes/deleteNote', async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.notes.getNotes}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete note');
        }

        return id;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Notes Slice
const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.notes = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch notes';
            })
            .addCase(updateNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.notes.findIndex(
                    (note) => note._id === action.payload._id
                );
                if (index !== -1) {
                    state.notes[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update note';
            })
            .addCase(deleteNote.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.notes = state.notes.filter(
                    (note) => note._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteNote.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete note';
            });
    },
});

export const selectNotes = (state: RootState) => state.notes;
export default notesSlice.reducer;
