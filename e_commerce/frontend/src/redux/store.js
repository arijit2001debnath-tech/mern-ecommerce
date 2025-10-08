import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice.js";
import authReducer from "./features/auth/authSlice.js"
import favouritesReducer from "../redux/features/favourites/FavouriteSlice.js"
import cartSliceReducer from "../redux/features/cart/cartSlice.js"
import shopReducer from "../redux/features/shop/shopSlice.js"
import { getFavouritesFromLocalStorage } from "../Utils/localStorage.js";

const initialFavourites = getFavouritesFromLocalStorage() || [];
const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        favourites: favouritesReducer,
        cart: cartSliceReducer,
        shop: shopReducer,
    },

    preloadedState: {
        favourites: initialFavourites,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});

setupListeners(store.dispatch);
export default store;