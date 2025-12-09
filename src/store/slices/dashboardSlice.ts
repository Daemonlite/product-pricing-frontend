import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface DashboardState {
    data: any;
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    data: {},
    loading: false,
    error: null,
  };

  export const fetchDashboard = createAsyncThunk(
    'dashboard/fetchDashboard',
    async (token: string, { rejectWithValue }) => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        const response = await axios.get(`${baseUrl}/products/pricing-dashboard/`, {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
  
        const data = response.data;
        console.log('Dashboard data:', data);
        return data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data?.detail || 'Failed to fetch dashboard');
      }
    }
  );

  export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchDashboard.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchDashboard.fulfilled, (state, action) => {
          state.loading = false;
          state.data = action.payload.data;
        })
        .addCase(fetchDashboard.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    },
  });

  export default dashboardSlice.reducer;