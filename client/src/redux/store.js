import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { api } from "./api/apiSlice";
import authReducer from "./auth/authSlice";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer, // do NOT persist this
  auth: authReducer, // persist only this
});

const persistConfig = {
  key: "root",
  storage,
  blacklist: [api.reducerPath], // avoid persisting RTK Query cache
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware),
});

export const persistor = persistStore(store);
