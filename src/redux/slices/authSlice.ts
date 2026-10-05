import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser } from '../../services/authService';
type SessionUser = { id: number; name: string; email: string };
export const login = createAsyncThunk('auth/login', (a: { email: string; password: string }) => loginUser(a.email, a.password));
export const register = createAsyncThunk('auth/register', (a: { name: string; email: string; password: string }) => registerUser(a.name, a.email, a.password));
const load = (): SessionUser | null => { try { return JSON.parse(localStorage.getItem('session') || 'null'); } catch { return null; } };
const slice = createSlice({
  name: 'auth', initialState: { user: load(), loading: false, error: undefined as string | undefined },
  reducers: { logout(s) { s.user = null; } },
  extraReducers: (b) => {
    for (const t of [login, register]) b
      .addCase(t.pending, (s) => { s.loading = true; s.error = undefined; })
      .addCase(t.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; })
      .addCase(t.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});
export const { logout } = slice.actions;
export default slice.reducer;
