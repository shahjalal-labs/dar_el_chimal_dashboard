import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SchoolFormState {
    schoolName: string
    address: string
    teacherCount: number
    activeTeachers: number
    studentCount: number
    activeStudents: number
    previewSchoolPhoto: string
    resourceFile: File | File[] | null;
    previewResourceFile: string[];
    resourceLink: string;
    schoolPhoto: File | null
    options: { value: string; label: string }[]
}

const initialState: SchoolFormState = {
    schoolName: '',
    address: '',
    teacherCount: 0,
    activeTeachers: 0,
    studentCount: 0,
    activeStudents: 0,
    previewSchoolPhoto: '',
    resourceFile: null,
    previewResourceFile: [],
    resourceLink: '',
    schoolPhoto: null,
    options: [],
};

const schoolSlice = createSlice({
    name: 'school',
    initialState,
    reducers: {
        setSchoolName: (state, action: PayloadAction<string>) => {
            state.schoolName = action.payload;
        },
        setAddress: (state, action: PayloadAction<string>) => {
            state.address = action.payload;
        },
        setTeacherCount: (state, action: PayloadAction<number>) => {
            state.teacherCount = action.payload;
        },
        setActiveTeachers: (state, action: PayloadAction<number>) => {
            state.activeTeachers = action.payload;
        },
        setStudentCount: (state, action: PayloadAction<number>) => {
            state.studentCount = action.payload;
        },
        setActiveStudents: (state, action: PayloadAction<number>) => {
            state.activeStudents = action.payload;
        },
        setSchoolPhoto: (state, action: PayloadAction<File | null>) => {
            state.schoolPhoto = action.payload;
        },
        setPreviewSchoolPhoto: (state, action: PayloadAction<string>) => {
            state.previewSchoolPhoto = action.payload;
        },
        setResourceFile: (state, action: PayloadAction<File | File[] | null>) => {
            state.resourceFile = action.payload;
        },
        setPreviewResourceFile: (state, action: PayloadAction<string[]>) => {
            state.previewResourceFile = action.payload;
        },
        setResourceLink: (state, action: PayloadAction<string>) => {
            state.resourceLink = action.payload;
        },
        setGradeOptions: (state, action: PayloadAction<{ value: string; label: string }[]>) => {
            state.options = action.payload;
        },
        clearGradeOptions: (state) => {
            state.options = [];
        },
    },
});

export const { setSchoolName, setAddress, setTeacherCount, setActiveTeachers, setStudentCount, setActiveStudents, setSchoolPhoto, setPreviewSchoolPhoto, setResourceFile, setPreviewResourceFile, setResourceLink, setGradeOptions, clearGradeOptions } = schoolSlice.actions;
export default schoolSlice.reducer;
