import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store/store";

interface AuthState {
    role: string | null;
    token: string | null;
    verifyToken: string | null;
}

const initialState: AuthState = {
    role: null,
    token: null,
    verifyToken: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.role = action.payload;
        },
        setUserToken: (state, action) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.token = null;
            Cookies.remove("token");
        }
    }
});

export const { setUser, setUserToken, logout } = authSlice.actions;
export default authSlice.reducer;
export const useAuth = (state: RootState) => state.auth;