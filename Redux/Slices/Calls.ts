import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../Store';

// Define a type for the slice state
interface UserTypes {
  outgoingCall: any;
  incomingCall: any;
  ongoingVoiceCall: any;
  outgoingVideoCall: any;
  incomingvideoCall: any;
  ongoingVideoCall: any;
}

const initialState: UserTypes = {
  outgoingCall: null,
  incomingCall: null,
  ongoingVoiceCall: null,
  outgoingVideoCall: null,
  incomingvideoCall: null,
  ongoingVideoCall: null,
};

const CallSlice = createSlice({
  name: 'CallSlice',
  initialState,
  reducers: {
    OutGoingVCall(state, action) {
      state.outgoingCall = action.payload;
    },
    IncomingVoiceCall(state, action) {
      state.incomingCall = action.payload;
    },
    EndVCall(state, action) {
      state.incomingCall = null;
      state.outgoingCall = null;
    },
    updateVoiceCall(state, action) {
      state.incomingCall = { ...state.incomingCall, callType: 'on_going' };
    },
    OngoingVoiceCall(state, action) {
      state.ongoingVoiceCall = action.payload;
    },
    OutGoingVideoCall(state, action) {
      state.outgoingVideoCall = action.payload;
    },
    IncomingVideoCall(state, action) {
      state.incomingvideoCall = action.payload;
    },
    EndVideoCall(state, action) {
      state.incomingvideoCall = null;
      state.outgoingVideoCall = null;
    },
    updateVideoCall(state, action) {
      state.incomingCall = { ...state.incomingCall, callType: 'on_going' };
    },
    OngoingVideoCall(state, action) {
      state.ongoingVideoCall = action.payload;
    },
  },
});

export const {
  IncomingVoiceCall,
  OutGoingVCall,
  EndVCall,
  updateVoiceCall,
  OngoingVoiceCall,
  IncomingVideoCall,
  OutGoingVideoCall,
  EndVideoCall,
  updateVideoCall,
  OngoingVideoCall,
} = CallSlice.actions;
export default CallSlice.reducer;
