// authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload || null;
    },
    clearUser(state) {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;

// 🔽 Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);
export const selectRoleId = (state) => state.auth.user?.role_id ?? null;
export const selectFullName = (state) =>
  state.auth.user
    ? `${state.auth.user.first_name} ${state.auth.user.last_name}`.trim()
    : "";
