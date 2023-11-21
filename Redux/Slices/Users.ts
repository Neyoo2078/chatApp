import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';

// Define a type for the slice state
interface UserTypes {
  activeChat: any;
  userChatList: any;
  currentUser: any;
  onlineUser: any;
}

const initialState: UserTypes = {
  activeChat: null,
  userChatList: [],
  currentUser: null,
  onlineUser: null,
};

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    CurrentUserDetails(state, action) {
      state.currentUser = action.payload;
    },
    ActiveChat(state, action) {
      state.activeChat = action.payload;
    },
    AddtoChatList(state, action) {
      state.userChatList = [...state.userChatList, action.payload];
    },
    OnlineUsers(state, action) {
      state.onlineUser = action.payload;
    },
  },
});

export const { ActiveChat, AddtoChatList, CurrentUserDetails, OnlineUsers } =
  UserSlice.actions;
export default UserSlice.reducer;
