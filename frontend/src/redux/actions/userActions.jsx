import { clearAllListeners, createAsyncThunk } from "@reduxjs/toolkit";
import userApi from "../../service/userApi";

export const registration = createAsyncThunk(
  "registration",
  async (details) => {
    try {
      let { data } = await userApi.post("user/registration", details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const login = createAsyncThunk(
  "login",
  async (details) => {
    try {
      let { data } = await userApi.post("user/login", details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const searchUser = createAsyncThunk(
  "searchUser",
  async (details) => {
    
    try {
      let { data } = await userApi.get(`user?search=${details}`);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const createChat = createAsyncThunk(
  "createChat",
  async (details) => {
    try {
      let { data } = await userApi.post(`chat/accesschat`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const fetchChat = createAsyncThunk(
  "fetchChat",
  async (details) => {
    try {
      let { data } = await userApi.get(`chat/fetchChat`);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const createGroup = createAsyncThunk(
  "createGroup",
  async (details) => {
    try {
      let { data } = await userApi.post(`chat/createGroup`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const renameGroup = createAsyncThunk(
  "renameGroup",
  async (details) => {
    try {
      let { data } = await userApi.put(`chat/renameGroup`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const addMembertoGroup = createAsyncThunk(
  "addMembertoGroup",
  async (details) => {
    try {
      let { data } = await userApi.put(`chat/addToGroup`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const removeFromGroup = createAsyncThunk(
  "removeFromGroup",
  async (details) => {
    try {
      let { data } = await userApi.put(`chat/removeFromGroup`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const sendMessages = createAsyncThunk(
  "sendMessage",
  async (details) => {
    try {
      let { data } = await userApi.post(`message`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getMessages = createAsyncThunk(
  "getMessages",
  async (details) => {
    console.log(details,"details");
    
    try {
      let { data } = await userApi.get(`message?chatId=${details?.chatId}&page=${details?.page}`);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const editMessage = createAsyncThunk(
  "editMessage",
  async (details) => {
    try {
      let { data } = await userApi.put(`message/editMessage`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const deleteMessage = createAsyncThunk(
  "deleteMessage",
  async (details) => {
    try {
      let { data } = await userApi.put(`message/deleteMessage`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const editProfile = createAsyncThunk(
  "editProfile",
  async (details) => {
    try {
      let { data } = await userApi.put(`user/editProfile`,details);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const QRcode = createAsyncThunk(
  "QRcode",
  async (details) => {
    try {
      let { data } = await userApi.get(`generate-qrcode`);
      return data;
    } catch (error) {
      return error.response.data;
    }
  }
);








