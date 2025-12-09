import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Department } from '@/types/auth';

interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
}

const initialState: DepartmentsState = {
  departments: [],
  loading: false,
  error: null,
};

export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/users/departments/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const departments = response.data;
      return departments;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch departments');
    }
  }
);

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default departmentsSlice.reducer;
