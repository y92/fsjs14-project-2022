import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import basketReducer from './basketSlice';
import paymentPopupReducer from './paymentPopupSlice';
import answerQuestionPopupReducer from './answerQuestionPopupSlice';
import deleteQuestionPopupReducer from './deleteQuestionPopupSlice';
import myClientsOrdersReducer from './myClientsOrdersSlice';
import myPutOrdersReducer from './myPutOrdersSlice';
import favoriteAdvertsReducer from './myFavoriteAdvertsSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        basket: basketReducer,
        paymentPopup: paymentPopupReducer,
        answerQuestionPopup: answerQuestionPopupReducer,
        deleteQuestionPopup: deleteQuestionPopupReducer,
        myClientsOrders: myClientsOrdersReducer,
        myPutOrders: myPutOrdersReducer,
        favoriteAdverts: favoriteAdvertsReducer
    }
})

export default store;