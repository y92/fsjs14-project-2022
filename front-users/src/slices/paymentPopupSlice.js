import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    display: false
};

export const paymentPopupSlice = createSlice({
    name: "paymentPopup",
    initialState,
    reducers: {
        setDisplay: (state, action) => {
            state.display = action.payload
        },
        display: (state) => {
            console.log("display");
            state.display = true;
        },
        dismiss: (state) => {
            console.log("dismiss");
            state.display = false;
        }
    }
})

export const {display, dismiss} = paymentPopupSlice.actions;

// selectors
export const selectPaymentPopup = state => state.paymentPopup;

export default paymentPopupSlice.reducer;