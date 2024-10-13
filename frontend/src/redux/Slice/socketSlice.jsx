// socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const socketSlice = createSlice({
  name: 'socket',
  initialState: {
    socket: null,
  },
  reducers: {
    setSocket: (state, action) => {
        console.log(action.payload,"action")
      state.socket = action.payload;
    },
    clearSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
      }
      state.socket = null;
    },
  },
});

export const { setSocket, clearSocket } = socketSlice.actions;
// export const selectSocket = (state) => state.socket.socket;

export default socketSlice.reducer;
