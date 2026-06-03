import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/Reducer.user';
import appReducer from './reducers/reducer.app';
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

const persistedAppReducer = persistReducer(
    {
        key: 'app',
        storage: storage.default ? storage.default : storage,
    },
    appReducer
);

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        app: persistedAppReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
