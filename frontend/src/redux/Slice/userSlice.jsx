import { createSlice } from "@reduxjs/toolkit";
import { editProfile, login, registration } from "../actions/userActions";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    chatWithuser: null,
    chatData: null,
    fcmToken: null,
  },
  reducers: {
    // Synchronous reducers
    chatWithUser: (state, action) => {
      state.chatWithuser = action.payload;
    },
    logout: (state, action) => {
      state.user = null; // Reset user state
      state.chatWithuser = null;
      state.chatData = null; // Reset chat state
      state.fcmToken = null;
      // reset other states as needed
    },
    chatNameStuff: (state, action) => {
      console.log(action.payload, "action");
      state.chatData = action.payload;
    },
    setFCMtoken: (state, action) => {
     
      state.fcmToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registration.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user = action.payload?.data?.user;
    });
    builder.addCase(editProfile.fulfilled, (state, action) => {
      console.log(action.payload,"datatatatatatatat");
      state.user = action.payload?.data;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      console.log(action.payload);
      state.user = action.payload?.data?.user;
    });
  },
});

export const { chatWithUser, logout, chatNameStuff, setFCMtoken } =
  userSlice.actions;

export default userSlice;
