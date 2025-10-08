import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookFormState {
    bookName: string;
    description: string;
    isbn: string;
    author: string;
    categoryName: string;
    categoryId: string;
    categoryImage: string;
    uploadImage: File | null;
    previewImage: string;
    uploadPdf: File | null;
    previewPdf: string;
    resourceType: string;
    resourceTitle: string;
    resourceDescription: string;
    resourceFile: File | null;
    previewResourceFile: string;
    resourceLink: string;
    schoolName: string;
    schoolId: string;
    image: string;
    schoolGradeMappings: [];
}

const initialState: BookFormState = {
    bookName: '',
    description: '',
    isbn: '',
    author: '',
    categoryName: '',
    categoryId: '',
    categoryImage: '',
    uploadImage: null,
    previewImage: '',
    uploadPdf: null,
    previewPdf: '',
    resourceType: '',
    resourceTitle: '',
    resourceDescription: '',
    resourceFile: null,
    previewResourceFile: '',
    resourceLink: '',
    schoolName: '',
    schoolId: '',
    image: '',
    schoolGradeMappings: [],
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBookName: (state, action: PayloadAction<string>) => {
            state.bookName = action.payload;
        },
        setDescription: (state, action: PayloadAction<string>) => {
            state.description = action.payload;
        },
        setISBN: (state, action: PayloadAction<string>) => {
            state.isbn = action.payload;
        },
        setAuthor: (state, action: PayloadAction<string>) => {
            state.author = action.payload;
        },
        setCategory: (state, action) => {
            state.categoryName = action.payload.categoryName;
            state.categoryId = action.payload.categoryId;
            state.categoryImage = action.payload.categoryImage;
        },
        setUploadImage: (state, action: PayloadAction<File | null>) => {
            state.uploadImage = action.payload;
        },
        setPreviewImage: (state, action: PayloadAction<string>) => {
            state.previewImage = action.payload;
        },
        setUploadPdf: (state, action: PayloadAction<File | null>) => {
            state.uploadPdf = action.payload;
        },
        setPreviewPdf: (state, action: PayloadAction<string>) => {
            state.previewPdf = action.payload;
        },
        setResourceType: (state, action: PayloadAction<string>) => {
            state.resourceType = action.payload;
        },
        setResourceTitle: (state, action: PayloadAction<string>) => {
            state.resourceTitle = action.payload;
        },
        setResourceDescription: (state, action: PayloadAction<string>) => {
            state.resourceDescription = action.payload;
        },
        setResourceFile: (state, action: PayloadAction<File | null>) => {
            state.resourceFile = action.payload;
        },
        setPreviewResourceFile: (state, action: PayloadAction<string>) => {
            state.previewResourceFile = action.payload;
        },
        setResourceLink: (state, action: PayloadAction<string>) => {
            state.resourceLink = action.payload;
        },
        setSchool: (state, action) => {
            state.schoolName = action.payload.schoolName;
            state.schoolId = action.payload.schoolId;
            state.image = action.payload.image;
        },
        setSchoolGradeMappings: (state, action) => {
            state.schoolGradeMappings = action.payload;
        },
    },
});

export const { setBookName, setDescription, setISBN, setAuthor, setCategory, setUploadImage, setPreviewImage, setUploadPdf, setPreviewPdf, setResourceType, setResourceTitle, setResourceDescription, setResourceFile, setPreviewResourceFile, setResourceLink, setSchool, setSchoolGradeMappings } = bookSlice.actions;
export default bookSlice.reducer;
