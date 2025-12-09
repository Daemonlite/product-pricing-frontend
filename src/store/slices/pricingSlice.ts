import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { PricingPayload, PricingResult } from '@/types/auth';

interface PricingState {
  result: PricingResult | null;
  pricings: any[];
  loading: boolean;
  error: string | null;
}

const initialState: PricingState = {
  result: null,
  pricings: [],
  loading: false,
  error: null,
};

export const calculatePricing = createAsyncThunk(
  'pricing/calculatePricing',
  async ({ token, payload }: { token: string; payload: PricingPayload }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.post(`${baseUrl}/products/pricing-calculator/`, payload, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.info || 'Failed to calculate');
    }
  }
);

export const getPricing = createAsyncThunk(
  'pricing/getPricing',
  async ({ token, shippingId }: { token: string; shippingId: string }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/products/pricing-calculator/${shippingId}/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data.info;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch pricing');
    }
  }
);

export const getAllPricings = createAsyncThunk(
  'pricing/getAllPricings',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/products/pricing-calculator/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data.info;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch all pricings');
    }
  }
);

const pricingSlice = createSlice({
  name: 'pricing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(calculatePricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculatePricing.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(calculatePricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getPricing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPricing.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(getPricing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllPricings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPricings.fulfilled, (state, action) => {
        state.loading = false;
        state.pricings = action.payload;
      })
      .addCase(getAllPricings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pricingSlice.reducer;
