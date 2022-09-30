import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    display: false,
    question: null
};

export const deleteQuestionPopupSlice = createSlice({
    name: "deleteQuestionPopup",
    initialState,
    reducers: {
        setDisplayDeleteQuestionPopup: (state, action) => {
            state.display = action.payload
        },
        setQuestionToDelete: (state, action) => {
            state.question = action.payload;
        },
        displayDeleteQuestionPopup: (state) => {
            state.display = true;
        },
        dismissDeleteQuestionPopup: (state) => {
            state.question = null;
            state.display = false;
        }
    }
})

export const {setQuestionToDelete, displayDeleteQuestionPopup, dismissDeleteQuestionPopup} = deleteQuestionPopupSlice.actions;

// selectors
export const selectDeleteQuestionPopup = state => state.deleteQuestionPopup;

export default deleteQuestionPopupSlice.reducer;