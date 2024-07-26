// features/user/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      console.log('payload', action);
      state.phoneNumber = action.payload;
    },
    clearUser(state, action) {
      state.phoneNumber = '';
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
