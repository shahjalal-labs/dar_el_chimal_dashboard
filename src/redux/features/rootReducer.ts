import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "@/redux/features/authSlice";
import bookReducer from "@/redux/features/bookSlice";
import schoolReducer from "@/redux/features/schoolSlice";
import teacherReducer from "@/redux/features/teacherSlice";
import studentReducer from "@/redux/features/studentSlice";
import uiReducer from "@/redux/features/uiSlice";

const rootReducer = combineReducers({
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    book: bookReducer,
    school: schoolReducer,
    teacher: teacherReducer,
    student: studentReducer,
    ui: uiReducer,
});

export default rootReducer;
