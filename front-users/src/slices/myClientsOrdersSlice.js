import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    pendingOrders: [],
    ordersToSend: [],
    sentOrders: [],
    cancelledOrders: []
}

export const myClientsOrdersSlice = createSlice({
    name: "myClientsOrders",
    initialState,
    reducers: {
        setPendingOrders: (state, action) => {
            state.pendingOrders = action.payload;
        },
        setOrdersToSend: (state, action) => {
            state.ordersToSend = action.payload;
        },
        setSentOrders: (state, action) => {
            state.sentOrders = action.payload;
        },
        setCancelledOrders: (state, action) => {
            state.cancelledOrders = action.payload;
        }
    }  
})

export const { setPendingOrders, setOrdersToSend, setSentOrders, setCancelledOrders } = myClientsOrdersSlice.actions;

export const selectMyClientsOrders = state => state.myClientsOrders;

export default myClientsOrdersSlice.reducer;