import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    display: false,
    question: null
};

export const answerQuestionPopupSlice = createSlice({
    name: "answerQuestionPopup",
    initialState,
    reducers: {
        setDisplayAnswerQuestionPopup: (state, action) => {
            state.display = action.payload
        },
        setQuestionToAnswer: (state, action) => {
            state.question = action.payload;
        },
        displayAnswerQuestionPopup: (state) => {
            //console.log("display");
            //console.log(state.question);
            state.display = true;
        },
        dismissAnswerQuestionPopup: (state) => {
            //console.log("dismiss");
            state.question = null;
            state.display = false;
        }
    }
})

export const {setQuestionToAnswer, displayAnswerQuestionPopup, dismissAnswerQuestionPopup} = answerQuestionPopupSlice.actions;

// selectors
export const selectAnswerQuestionPopup = state => state.answerQuestionPopup;

export default answerQuestionPopupSlice.reducer;