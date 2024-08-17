// features/user/userSlice.js
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  password:'',
  email:'',
  token:'',
  userid:'',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      console.log('payload', action);
      const  {email ,password, token, userid } = action.payload;
      state.email = email || state.email;
      state.password = password || state.password;
      state.token = token || state.token;
      state.userid = userid || state.userid;
    },
    clearUser(state) {
      state.email = '';
      state.password = '';
      state.token = '';
      state.userid= '';
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;

export default userSlice.reducer;
