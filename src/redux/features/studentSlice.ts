import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentFormState {
    studentName: string
    studentUserName: string
    studentPassword: string
    previewStudentPhoto: string
    studentPhoto: File | null
    options: { value: string; label: string }[]
}

const initialState: StudentFormState = {
    studentName: '',
    studentUserName: '',
    studentPassword: '',
    previewStudentPhoto: '',
    studentPhoto: null,
    options: [],
};

const studentSlice = createSlice({
    name: 'student',
    initialState,
    reducers: {
        setStudentName: (state, action: PayloadAction<string>) => {
            state.studentName = action.payload;
        },
        setStudentUserName: (state, action: PayloadAction<string>) => {
            state.studentUserName = action.payload;
        },
        setStudentPassword: (state, action: PayloadAction<string>) => {
            state.studentPassword = action.payload;
        },
        setStudentPhoto: (state, action: PayloadAction<File | null>) => {
            state.studentPhoto = action.payload;
        },
        setPreviewStudentPhoto: (state, action: PayloadAction<string>) => {
            state.previewStudentPhoto = action.payload;
        },
        setGradeOptions: (state, action: PayloadAction<{ value: string; label: string }[]>) => {
            state.options = action.payload;
        },
        clearGradeOptions: (state) => {
            state.options = [];
        },
    },
});

export const { setStudentName, setStudentUserName, setStudentPassword, setStudentPhoto, setPreviewStudentPhoto, setGradeOptions, clearGradeOptions } = studentSlice.actions;
export default studentSlice.reducer;
