// store/store.js
import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({
  //   immutableCheck: false,
  //   serializableCheck: false,
  // })
});

export default store;
