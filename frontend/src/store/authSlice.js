import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

/* ── thunks ──────────────────────────────────────────────────────── */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      localStorage.setItem('token', res.data.token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message ?? 'Registration failed');
    }
  }
);

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await authApi.updateProfile(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

/* ── slice ───────────────────────────────────────────────────────── */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:        null,
    token:       localStorage.getItem('token') ?? null,
    loading:     false,
    error:       null,
    initialized: !localStorage.getItem('token'),   // true if no token, false if token (will be set after fetchMe)
  },
  reducers: {
    logout(state) {
      state.user        = null;
      state.token       = null;
      state.initialized = true;
      localStorage.removeItem('token');
    },
    clearError(state) { state.error = null; },
  },
  extraReducers(builder) {
    const pending   = (s) => { s.loading = true; s.error = null; };
    const rejected  = (s, a) => { s.loading = false; s.error = a.payload; };
    const setAuth   = (s, a) => {
      s.loading     = false;
      s.user        = a.payload.user;
      s.token       = a.payload.token ?? s.token;
      s.initialized = true;
    };

    builder
      .addCase(loginUser.pending,    pending)
      .addCase(loginUser.fulfilled,  setAuth)
      .addCase(loginUser.rejected,   rejected)
      .addCase(registerUser.pending,   pending)
      .addCase(registerUser.fulfilled, setAuth)
      .addCase(registerUser.rejected,  rejected)
      .addCase(fetchMe.pending,    pending)
      .addCase(fetchMe.fulfilled,  (s, a) => {
        s.loading     = false;
        s.user        = a.payload.user;
        s.initialized = true;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.loading     = false;
        s.initialized = true;
        s.token       = null;
        localStorage.removeItem('token');
      })
      .addCase(updateProfile.fulfilled, (s, a) => { s.user = a.payload.user; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;