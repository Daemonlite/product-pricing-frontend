import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Role } from '@/types/auth';

interface RolesState {
  roles: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RolesState = {
  roles: [],
  loading: false,
  error: null,
};

export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/users/roles/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      let roles = response.data?.info || response.data;

      // Ensure roles is always an array
      if (!Array.isArray(roles)) {
        // If it's an object with a roles property, extract it
        if (roles && typeof roles === 'object' && 'roles' in roles) {
          roles = roles.roles;
        }
        // If it's still not an array, wrap it in an array or return empty array
        if (!Array.isArray(roles)) {
          roles = roles ? [roles] : [];
        }
      }

      return roles;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch roles');
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async ({ token, roleName }: { token: string; roleName: string }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.post(`${baseUrl}/users/roles/`, {
        name: roleName,
      }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to create role');
    }
  }
);

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = [...state.roles, action.payload];
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default rolesSlice.reducer;
