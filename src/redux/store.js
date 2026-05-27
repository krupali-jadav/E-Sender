import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/UserReducer';
import {
    persistStore,
    persistReducer,
} from 'redux-persist';

import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage: storage.default ? storage.default : storage,
};

const persistedReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
    reducer: {
        users: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
