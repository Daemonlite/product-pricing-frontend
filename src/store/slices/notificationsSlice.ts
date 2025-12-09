import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Notification } from '@/types/auth';

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  loading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.get(`${baseUrl}/userActivities/notifications/fetch-user-notifications/`, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      const notifications = response.data.results?.info || response.data.info || response.data;
      return notifications.filter((n: any) => n.is_read === false);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch notifications');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (token: string, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.patch(`${baseUrl}/userActivities/notifications/mark-all-as-read/`, {}, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark notifications as read');
    }
  }
);

export const markOneNotificationAsRead = createAsyncThunk(
  'notifications/markOneNotificationAsRead',
  async ({ token, uid }: { token: string; uid: string }, { rejectWithValue }) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const response = await axios.patch(`${baseUrl}/userActivities/notifications/mark-notification-as-read/${uid}/`, {}, {
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to mark notification as read');
    }
  }
);

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAllNotificationsAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state, action) => {
        state.loading = false;
        // Update read status for all notifications (set both `read` and `is_read` for compatibility)
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true,
          is_read: true,
        }));
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // handle single notification mark-as-read
    builder.addCase(markOneNotificationAsRead.fulfilled, (state, action) => {
      const updated: any = action.payload;
      state.loading = false;
    
      state.notifications = state.notifications.map(notification => {
        if ((updated && updated.uid && (notification as any).uid === updated.uid) || (updated && updated.id && notification.id === updated.id)) {
          return {
            ...notification,
            read: true,
            is_read: true,
          } as any;
        }
        return notification;
      });
    }).addCase(markOneNotificationAsRead.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default notificationsSlice.reducer;
