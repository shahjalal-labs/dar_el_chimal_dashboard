import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { RootState } from "../store/store";

interface AuthState {
    role: string | null;
    businessCategory: string | null;
    token: string | null;
    forgetToken: string | null;
    verifyToken: string | null;
}

const initialState: AuthState = {
    role: null,
    businessCategory: null,
    token: null,
    forgetToken: null,
    verifyToken: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.role = action.payload.role;
            state.businessCategory = action.payload.businessCategory;
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

export const { setUser, setUserToken,logout } = authSlice.actions;
export default authSlice.reducer;
export const useAuth = (state: RootState) => state.auth;