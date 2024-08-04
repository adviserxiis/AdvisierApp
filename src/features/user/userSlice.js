// features/user/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  phoneNumber: '',
  email:'',
  token:'',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      console.log('payload', action);
      const  {email, phoneNumber , token } = action.payload;
      state.email = email || state.email;
      state.phoneNumber = phoneNumber || state.phoneNumber;
      state.token = token || state.token;
    },
    clearUser(state, action) {
      state.phoneNumber = '';
      state.email = '';
      state.token = '';
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
