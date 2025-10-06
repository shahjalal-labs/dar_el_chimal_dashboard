import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UiState {
    activeBookTab: "general" | "resources" | "grade";
}

const initialState: UiState = {
    activeBookTab: "general",
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setActiveBookTab: (state, action: PayloadAction<UiState["activeBookTab"]>) => {
            state.activeBookTab = action.payload;
        },
    },
});

export const { setActiveBookTab } = uiSlice.actions;
export default uiSlice.reducer;
