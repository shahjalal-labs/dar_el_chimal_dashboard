import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TeacherFormState {
    teacherName: string
    userName: string
    password: string
    email: string
    teacherSchoolName: string
    numberOfTeacher: number
    teacherPhoto: File | null
    previewTeacherPhoto: string
    teacherList: {
        loginUserName: string
        password: string
    }[]
    options: { value: string; label: string }[]
}

const initialState: TeacherFormState = {
    teacherName: '',
    userName: '',
    password: '',
    email: '',
    teacherSchoolName: '',
    numberOfTeacher: 0,
    previewTeacherPhoto: '',
    teacherList: [],
    teacherPhoto: null,
    options: [],
};

const teacherSlice = createSlice({
    name: 'teacher',
    initialState,
    reducers: {
        setTeacherName: (state, action: PayloadAction<string>) => {
            state.teacherName = action.payload;
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
        },
        setTeacherSchoolName: (state, action: PayloadAction<string>) => {
            state.teacherSchoolName = action.payload;
        },
        setNumberOfTeacher: (state, action: PayloadAction<number>) => {
            state.numberOfTeacher = action.payload;
        },
        setTeacherPhoto: (state, action: PayloadAction<File | null>) => {
            state.teacherPhoto = action.payload;
        },
        setPreviewTeacherPhoto: (state, action: PayloadAction<string>) => {
            state.previewTeacherPhoto = action.payload;
        },
        setGradeOptions: (state, action: PayloadAction<{ value: string; label: string }[]>) => {
            state.options = action.payload;
        },
        clearGradeOptions: (state) => {
            state.options = [];
        },
        setTeachersList: (state, action: PayloadAction<{ loginUserName: string; password: string }[]>) => {
            state.teacherList = action.payload;
        },
    },
});

export const { setTeacherName, setUserName, setPassword, setEmail, setTeacherSchoolName, setNumberOfTeacher, setTeacherPhoto, setPreviewTeacherPhoto, setTeachersList, setGradeOptions, clearGradeOptions } = teacherSlice.actions;
export default teacherSlice.reducer;
