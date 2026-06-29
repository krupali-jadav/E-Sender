import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/Reducer.user';
import appReducer from './reducers/reducer.app';
import domainReducer from './reducers/reducer.Domain';
import { persistStore, persistReducer, } from 'redux-persist';
import campaignReducer from "../redux/reducers/reducer.Campaign";

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

const persistedCampaignReducer = persistReducer(
    { key: 'campaign', storage: storage.default ? storage.default : storage },
    campaignReducer
)

export const store = configureStore({
    reducer: {
        user: persistedReducer,
        app: persistedAppReducer,
        domain: domainReducer,
        campaign: persistedCampaignReducer

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);

export default store;
