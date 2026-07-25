import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    activeBookTab: "general" | "resources" | "grade" | "assign";
    activeClassId: string | null;
}

const initialState: UiState = {
    activeBookTab: "general",
    activeClassId: null,
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setActiveBookTab: (state, action: PayloadAction<UiState["activeBookTab"]>) => {
            state.activeBookTab = action.payload;
        },
        setActiveClassId: (state, action: PayloadAction<string | null>) => {
            state.activeClassId = action.payload;
        },
    },
});

export const { setActiveBookTab, setActiveClassId } = uiSlice.actions;
export default uiSlice.reducer;
