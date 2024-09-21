import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userSlice from "./Slice/userSlice.jsx";

// Persist configuration
const persistConfig = {
    key: 'root',
    storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userSlice.reducer);

// Configure store with the persisted reducer
const store = configureStore({
    reducer: {
        userData: persistedReducer, // Use persisted reducer
    },
});

// Create the persistor
export const persistor = persistStore(store);
export default store;
