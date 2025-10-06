import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "@/redux/features/authSlice";
import bookReducer from "@/redux/features/bookSlice";
import uiReducer from "@/redux/features/uiSlice";

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    book: bookReducer,
    ui: uiReducer,
});

export default rootReducer;
