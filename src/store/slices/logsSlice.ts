import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Log } from '@/types/auth';

interface LogsState {
  logs: Log[];
  loading: boolean;
  error: string | null;
}

const initialState: LogsState = {
  logs: [],
  loading: false,
  error: null,
};

export const fetchLogs = createAsyncThunk(
  'logs/fetchLogs',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/userActivities/user-activities/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      const logs = response.data.results.info.map((log: any) => {
        let type = 'default'
        switch (log.action_type.toLowerCase()) {
          case 'update':
            type = 'info'
            break
          case 'create':
            type = 'success'
            break
          case 'delete':
            type = 'error'
            break
          case 'login':
            type = 'success'
            break
          default:
            type = 'warning'
        }
        return {
          ...log,
          type
        }
      })
      console.log('log:', logs)
      return logs
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch logs');
    }
  }
);

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default logsSlice.reducer;
