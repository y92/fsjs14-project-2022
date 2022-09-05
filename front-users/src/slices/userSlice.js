import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    datas: {},
    isLogged: false
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        connect: (state, action) => {
            state.data = action.payload;
            state.isLogged = true;
        },
        afterUpdateProfile: (state, action) => {
            state.data = action.payload;
            state.isLogged = true;
        },
        logout: (state) => {
            state.data = {};
            state.isLogged = false;
        }
    }
})

export const {connect, afterUpdateProfile, logout} = userSlice.actions;

// selectors
export const selectUser = state => state.user;

export default userSlice.reducer;