import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import basketReducer from './basketSlice';
import paymentPopupReducer from './paymentPopupSlice';
import answerQuestionPopupReducer from './answerQuestionPopupSlice';
import myClientsOrdersReducer from './myClientsOrdersSlice';
import myPutOrdersReducer from './myPutOrdersSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        basket: basketReducer,
        paymentPopup: paymentPopupReducer,
        answerQuestionPopup: answerQuestionPopupReducer,
        myClientsOrders: myClientsOrdersReducer,
        myPutOrders: myPutOrdersReducer
    }
})

export default store;