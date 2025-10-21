import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface StudentFormState {
    studentName: string
    studentUserName: string
    email: string
    studentPassword: string
    previewStudentPhoto: string
    studentPhoto: File | null
    options: { value: string; label: string }[]
    studentSchoolName: string
    numberOfStudent: number
    studentList: {
        loginUserName: string
        password: string
    }[]
}

const initialState: StudentFormState = {
    studentName: '',
    studentUserName: '',
    email: 'abc@gmail.com',
    studentPassword: '',
    previewStudentPhoto: '',
    studentPhoto: null,
    options: [],
    studentSchoolName: '',
    numberOfStudent: 0,
    studentList: [],
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
        setEmail: (state, action: PayloadAction<string>) => {
            state.email = action.payload;
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
        setStudentSchoolName: (state, action: PayloadAction<string>) => {
            state.studentSchoolName = action.payload;
        },
        setNumberOfStudent: (state, action: PayloadAction<number>) => {
            state.numberOfStudent = action.payload;
        },
        setStudentList: (state, action: PayloadAction<{ loginUserName: string; password: string }[]>) => {
            state.studentList = action.payload;
        },
    },
});

export const { setStudentName, setStudentUserName, setEmail, setStudentPassword, setStudentPhoto, setPreviewStudentPhoto, setGradeOptions, clearGradeOptions, setStudentSchoolName, setNumberOfStudent, setStudentList } = studentSlice.actions;
export default studentSlice.reducer;
