import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import basketReducer from './basketSlice';
import paymentPopupReducer from './paymentPopupSlice';
import answerQuestionPopupReducer from './answerQuestionPopupSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        basket: basketReducer,
        paymentPopup: paymentPopupReducer,
        answerQuestionPopup: answerQuestionPopupReducer
    }
})

export default store;