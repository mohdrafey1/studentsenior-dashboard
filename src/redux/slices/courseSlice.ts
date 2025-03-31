import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { api } from '@/config/apiUrls';

export interface Course {
    _id: string;
    courseName: string;
    courseCode: string;
    totalBranch: number;
    totalNotes: number;
    totalPyqs: number;
    clickCounts: number;
    createdAt: string;
}

interface CourseState {
    courses: Course[];
    loading: boolean;
    error: string | null;
}

const initialState: CourseState = {
    courses: [],
    loading: false,
    error: null,
};

const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

// Async Thunk to Fetch Courses
export const fetchCourses = createAsyncThunk<
    Course[],
    void,
    { rejectValue: string }
>('courses/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.courses);
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to fetch courses');
        }
        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Add Course
export const addCourse = createAsyncThunk<
    Course,
    Omit<
        Course,
        | '_id'
        | 'totalBranch'
        | 'totalNotes'
        | 'totalPyqs'
        | 'clickCounts'
        | 'createdAt'
    >,
    { rejectValue: string }
>('courses/addCourse', async (courseData, { rejectWithValue }) => {
    try {
        const res = await fetch(api.resource.courses, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(courseData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to add course');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Update Course
export const updateCourse = createAsyncThunk<
    Course,
    { id: string; courseData: Partial<Omit<Course, '_id' | 'createdAt'>> },
    { rejectValue: string }
>('courses/updateCourse', async ({ id, courseData }, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.resource.courses}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(courseData),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to update course');
        }

        return await res.json();
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Async Thunk to Delete Course
export const deleteCourse = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('courses/deleteCourse', async (id, { rejectWithValue }) => {
    try {
        const res = await fetch(`${api.resource.courses}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Failed to delete course');
        }

        return id;
    } catch (error) {
        return rejectWithValue(
            error instanceof Error ? error.message : 'An unknown error occurred'
        );
    }
});

// Courses Slice
const courseSlice = createSlice({
    name: 'courses',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.courses = action.payload;
                state.loading = false;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch courses';
            })
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
                state.loading = false;
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to add course';
            })
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex(
                    (course) => course._id === action.payload._id
                );
                if (index !== -1) {
                    state.courses[index] = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to update course';
            })
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courses = state.courses.filter(
                    (course) => course._id !== action.payload
                );
                state.loading = false;
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to delete course';
            });
    },
});

export const selectCourses = (state: RootState) => state.courses;
export default courseSlice.reducer;
