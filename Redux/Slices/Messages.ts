import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';

// Define a type for the slice state
interface UserTypes {
  activeMessages: any;
  sockett: any;
}

const initialState: UserTypes = {
  activeMessages: null,
  sockett: null,
};

const MessageSlice = createSlice({
  name: 'UserSlice',
  initialState,
  reducers: {
    DbActiveMessages(state, action) {
      state.activeMessages = action.payload;
    },
    UpdateActiveMessages(state, action) {
      state.activeMessages = [...state.activeMessages, action.payload];
    },
    SocketReducer(state, action) {
      state.sockett = action.payload;
    },
  },
});

export const { DbActiveMessages, UpdateActiveMessages, SocketReducer } =
  MessageSlice.actions;
export default MessageSlice.reducer;
