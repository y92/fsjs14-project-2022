import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import basketReducer from './basketSlice';
import paymentPopupReducer from './paymentPopupSlice';

const store = configureStore({
    reducer: {
        user: userReducer,
        basket: basketReducer,
        paymentPopup: paymentPopupReducer
    }
})

export default store;