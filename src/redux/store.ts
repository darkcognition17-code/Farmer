import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import languageReducer from './slices/languageSlice';
import authReducer from './slices/authSlice';
import contentReducer from './slices/contentSlice';
import livestockReducer from './slices/livestockSlice';
import addLivestockReducer from './slices/addLivestockSlice';
import updateLivestockReducer from './slices/updateLivestockSlice';
import machniaryReducer from './slices/machinarySlice';

const rootReducer = combineReducers({
  language: languageReducer,
  auth: authReducer,
  content: contentReducer,
  livestock: livestockReducer,
  addLivestock: addLivestockReducer,
  updateLivestock: updateLivestockReducer,
  machineryStock: machniaryReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['language', 'auth'], // persist language and auth slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
