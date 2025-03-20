// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./features/user";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";
import userReducer from "./features/user"; // Your user reducer
import reportReducer from './features/report'
const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  report: reportReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
