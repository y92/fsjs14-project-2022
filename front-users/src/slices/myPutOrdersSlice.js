import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    orders: [],
}

export const myPutOrdersSlice = createSlice({
    name: "myPutOrders",
    initialState,
    reducers: {
        setOrders: (state, action) => {
            state.orders = action.payload;
        }
    }  
})

export const { setOrders } = myPutOrdersSlice.actions;

export const selectMyPutOrders = state => state.myPutOrders;

export default myPutOrdersSlice.reducer;