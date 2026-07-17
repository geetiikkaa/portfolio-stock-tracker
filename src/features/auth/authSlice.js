import { createSlice } from "@reduxjs/toolkit";

let authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    },
});

export let { setUser, logout } = authSlice.actions;
export default authSlice.reducer;