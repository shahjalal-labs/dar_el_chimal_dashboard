import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookFormState {
    bookName: string;
    description: string;
    isbn: string;
    author: string;
    category: string;
    uploadImage: File | null;
    uploadPdf: File | null;
}

const initialState: BookFormState = {
    bookName: '',
    description: '',
    isbn: '',
    author: '',
    category: '',
    uploadImage: null,
    uploadPdf: null,
};

const bookSlice = createSlice({
    name: 'book',
    initialState,
    reducers: {
        setBookData: (state, action: PayloadAction<Partial<BookFormState>>) => {
            return { ...state, ...action.payload };
        },
        clearBookData: () => initialState,
    },
});

export const { setBookData, clearBookData } = bookSlice.actions;
export default bookSlice.reducer;
