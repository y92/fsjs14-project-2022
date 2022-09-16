import { createSlice } from '@reduxjs/toolkit';

let lsBasket = JSON.parse(window.localStorage.getItem('library-basket'));

if (lsBasket === null) {
    lsBasket = [];
}

const initialState = {
    basket: lsBasket
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        modifyBasket: (state, action) => {
            state.basket = action.payload;
        },
        cleanBasket: (state) =>{
            state.basket = [];
        }
    }
})

export const { modifyBasket, cleanBasket } = basketSlice.actions;

// selectors
export const selectBasket = state => state.basket;

export default basketSlice.reducer;