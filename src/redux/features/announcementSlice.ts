import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SchoolFormState {
    announcement: string;
    announcementTitle: string;
    announcementDate: Date | null;
}

const initialState: SchoolFormState = {
    announcement: '',
    announcementTitle: '',
    announcementDate: null,
};

const announcementSlice = createSlice({
    name: 'announcement',
    initialState,
    reducers: {
        setAnnouncement: (state, action: PayloadAction<string>) => {
            state.announcement = action.payload;
        },
        setAnnouncementTitle: (state, action: PayloadAction<string>) => {
            state.announcementTitle = action.payload;
        },
        setAnnouncementDate: (state, action: PayloadAction<Date | null>) => {
            state.announcementDate = action.payload;
        },
    },
});

export const { setAnnouncement, setAnnouncementTitle, setAnnouncementDate } = announcementSlice.actions;
export default announcementSlice.reducer;
