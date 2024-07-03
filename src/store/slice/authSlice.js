import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        adminAccessToken: null,
        adminExpiresIn: null,
        userAccessToken: null,
        userExpiresIn: null,
        isUserAuthenticated: false,
        cartCount: 0,
    },
    reducers: {
        setAdminAccessToken: (state, action) => {
            state.adminAccessToken = action.payload.token;
            state.adminExpiresIn = action.payload.expiresIn;
        },
        removeAdminAccessToken: (state) => {
            state.adminAccessToken = null;
            state.adminExpiresIn = null;
        },
        setUserAccessToken: (state, action) => {
            state.userAccessToken = action.payload.token;
            state.userExpiresIn = action.payload.expiresIn;
        },
        removeUserAccessToken: (state) => {
            state.userAccessToken = null;
            state.userExpiresIn = null;
        },
        setUserAuthenticated: (state, action) => {
            state.isUserAuthenticated = action.payload;
        },
        setCartCount: (state, action) => {
            state.cartCount = action.payload;
        },
    },
});

export const {
    setAdminAccessToken,
    removeAdminAccessToken,
    setUserAccessToken,
    removeUserAccessToken,
    setUserAuthenticated,
    setCartCount,
} = authSlice.actions;

export default authSlice.reducer;
