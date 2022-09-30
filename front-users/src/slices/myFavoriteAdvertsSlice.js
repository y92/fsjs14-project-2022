import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    adverts: [],
}

export const favoriteAdvertsSlice = createSlice({
    name: "favoriteAdverts",
    initialState,
    reducers: {
        modifyFavoriteAdverts: (state, action) => {
            state.adverts = action.payload;
        },
        clearFavoriteAdverts: (state) =>{
            state.adverts = [];
        }
    }
})

export const { modifyFavoriteAdverts, clearFavoriteAdverts } = favoriteAdvertsSlice.actions;

// selectors
export const selectFavoriteAdverts = state => state.favoriteAdverts;

export default favoriteAdvertsSlice.reducer;