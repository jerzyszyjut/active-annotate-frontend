import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store.ts";


interface AuthState {
    token: string | null
    isAuthenticated: boolean,
};

const initialState: AuthState = {
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token")
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { token } = action.payload;
            state.token = token
            state.isAuthenticated = true;
            localStorage.setItem("token", token);
        },
        logOut: (state) => {
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        }
    }
});

export const { setCredentials, logOut } = authSlice.actions

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAccessToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;