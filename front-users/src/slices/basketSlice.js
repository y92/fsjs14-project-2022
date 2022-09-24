import { createSlice } from '@reduxjs/toolkit';
import { config } from '../config';

let lsBasket = JSON.parse(window.localStorage.getItem(config.LS_BASKET_KEY));

if (lsBasket === null) {
    lsBasket = [];
}

let totalPrice = getTotalPrice(lsBasket);

const initialState = {
    basket: lsBasket,
    totalPrice: totalPrice
}

function getTotalPrice(basket) {
    let res = 0;
    for (let i=0; i<basket.length; i++) {
        res += parseFloat(basket[i].price * basket[i].selectedQuantity);
    }

    return res;
}

export const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {
        modifyBasket: (state, action) => {
            let totalPrice = getTotalPrice(action.payload);
            state.basket = action.payload;
            state.totalPrice = parseFloat(totalPrice.toFixed(2));
        },
        clearBasket: (state) =>{
            state.basket = [];
            state.totalPrice = 0;
        }
    }
})

export const { modifyBasket, clearBasket } = basketSlice.actions;

// selectors
export const selectBasket = state => state.basket;

export default basketSlice.reducer;