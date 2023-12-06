'use client';
import Image from 'next/image';
import React from 'react';
import {
  OngoingVideoCall,
  IncomingVideoCall as IncomingVideoCalls,
} from '@/Redux/Slices/Calls';
import { useDispatch } from 'react-redux';
import { EndVideoCall } from '@/Redux/Slices/Calls';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';

const IncomingVideoCall = () => {
  const dispatch = useAppDispatch();

  const {
    outgoingCall,
    incomingCall,
    ongoingVoiceCall,
    outgoingVideoCall,
    incomingvideoCall,
  } = useAppSelector((state) => state.Calls);

  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );
  console.log({ incomingvideoCall });

  const acceptCall = () => {
    dispatch(OngoingVideoCall({ ...incomingvideoCall, callType: 'on_going' }));
    socket.emit('accept-incoming-Vcall', { id: incomingvideoCall.id });
    dispatch(IncomingVideoCalls(undefined));
  };

  const rejectCall = () => {
    socket.emit('reject-video-call', { from: incomingvideoCall.id });
    dispatch(EndVideoCall());
  };
  return (
    <div className="absolute w-[400px] h-[200px] text-white gap-2 flex-col  flex justify-center items-center bg-black bottom-[100px] m-auto ">
      <Image
        src={incomingvideoCall?.avatar}
        alt='"avatar'
        width={70}
        height={70}
        className="rounded-full"
      />
      <div>{incomingvideoCall.displayName}</div>
      <div className="text-xs">Incoming Video Call</div>
      <div className="flex gap-2 mt-2">
        <button
          className="bg-[#d02222] p-1 px-3 text-sm rounded-full"
          onClick={rejectCall}
        >
          Reject Call
        </button>
        <button
          className="bg-[#089906] p-1 px-3 text-sm rounded-full"
          onClick={acceptCall}
        >
          Accept Call
        </button>
      </div>
    </div>
  );
};

export default IncomingVideoCall;
