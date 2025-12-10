import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Shipping, ShippingItem } from '@/types/auth';

interface ShippingsState {
  shippings: Shipping[];
  loading: boolean;
  error: string | null;
}

const initialState: ShippingsState = {
  shippings: [],
  loading: false,
  error: null,
};

export const fetchShippings = createAsyncThunk(
  'shippings/fetchShippings',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/shipping/shippings/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const shippings = response.data.info;
      return shippings;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch shippings');
    }
  }
);

export const createShipping = createAsyncThunk(
  'shippings/createShipping',
  async ({ token, shipping }: { token: string; shipping: { name: string; arrival_date: string; tracking_number: string; carrier: string; items: { product: number; quantity: number, unit_price: string }[] } }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.post(`${baseUrl}/shipping/shippings/`, shipping, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.info || 'Failed to create shipping');
    }
  }
);

export const updateShipping = createAsyncThunk(
  'shippings/updateShipping',
  async ({ token, uid, shipping }: { token: string; uid: string; shipping: Partial<{ name: string; arrival_date: string; tracking_number: string; carrier: string; status: string; items: { product: number; quantity: number, unit_price: string }[] }> }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.patch(`${baseUrl}/shipping/shippings/${uid}/`, shipping, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update shipping');
    }
  }
);

export const deleteShipping = createAsyncThunk(
  'shippings/deleteShipping',
  async ({ token, uid }: { token: string; uid: string }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      await axios.delete(`${baseUrl}/shipping/shippings/${uid}/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return uid;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete shipping');
    }
  }
);

export const confirmShipmentDelivered = createAsyncThunk(
  'shippings/confirmShipmentDelivered',
  async ({ token, id }: { token: string; id: number }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.post(`${baseUrl}/shipping/shippings/confirm-shipment-delivered/`, { shipping_id: id }, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to confirm shipment delivered');
    }
  }
);

const shippingsSlice = createSlice({
  name: 'shippings',
  initialState,
  reducers: {
    updateShippingState: (state, action) => {
      const index = state.shippings.findIndex(ship => ship.uid === action.payload.uid);
      if (index !== -1) {
        state.shippings[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShippings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShippings.fulfilled, (state, action) => {
        state.loading = false;
        state.shippings = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchShippings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createShipping.fulfilled, (state, action) => {
        state.loading = false;
        state.shippings = [...state.shippings, action.payload];
      })
      .addCase(createShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateShipping.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.shippings.findIndex(ship => ship.uid === action.payload.uid);
        if (index !== -1) {
          state.shippings[index] = { ...state.shippings[index], ...action.payload };
        }
      })
      .addCase(updateShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteShipping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteShipping.fulfilled, (state, action) => {
        state.loading = false;
        state.shippings = state.shippings.filter(ship => ship.uid !== action.payload);
      })
      .addCase(deleteShipping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(confirmShipmentDelivered.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(confirmShipmentDelivered.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally update the shipment status to 'delivered' if needed
        // For now, we can refetch or assume the backend updates it
      })
      .addCase(confirmShipmentDelivered.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { updateShippingState } = shippingsSlice.actions;
export default shippingsSlice.reducer;
