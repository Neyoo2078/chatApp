import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';

// Define a type for the slice state
interface UserTypes {
  zgVar: any;

  localStream: any;
  publishStream: any;
  roomId: any;
}

const initialState: UserTypes = {
  zgVar: null,
  localStream: null,
  publishStream: null,
  roomId: null,
};

const ZegoSlice = createSlice({
  name: 'ZegoSlice',
  initialState,
  reducers: {
    zgVars(state, action) {
      state.zgVar = action.payload;
    },
    localStreams(state, action) {
      state.localStream = action.payload;
    },
    publishStreams(state, action) {
      state.publishStream = action.payload;
    },
    RoomIds(state, action) {
      state.roomId = action.payload;
    },
  },
});

export const { zgVars, localStreams, publishStreams, RoomIds } =
  ZegoSlice.actions;
export default ZegoSlice.reducer;
