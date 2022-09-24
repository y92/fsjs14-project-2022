import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    display: false,
    question: null
};

export const answerQuestionPopupSlice = createSlice({
    name: "answerQuestionPopup",
    initialState,
    reducers: {
        setDisplay: (state, action) => {
            state.display = action.payload
        },
        setQuestion: (state, action) => {
            state.question = action.payload;
        },
        display: (state) => {
            //console.log("display");
            //console.log(state.question);
            state.display = true;
        },
        dismiss: (state) => {
            //console.log("dismiss");
            state.question = null;
            state.display = false;
        }
    }
})

export const {setQuestion, display, dismiss} = answerQuestionPopupSlice.actions;

// selectors
export const selectAnswerQuestionPopup = state => state.answerQuestionPopup;

export default answerQuestionPopupSlice.reducer;