'use client';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { EndVCall as EndCall } from '@/Redux/Slices/Calls';
import {
  IncomingVoiceCall as IncomingVoiceCalls,
  OngoingVoiceCall,
} from '@/Redux/Slices/Calls';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';

const IncomingVoiceCall = () => {
  const dispatch = useAppDispatch();

  // useSelector
  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );
  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );

  const { outgoingCall, incomingCall } = useAppSelector((state) => state.Calls);

  //   const cc = {
  //     to: data._id,
  //     from: {
  //       id: ReducerSesiion._id,
  //       avatar: ReducerSesiion.avatar,
  //       displayName: ReducerSesiion.displayName,
  //     },
  //     callType: data.callType,
  //     roomId: data.roomId,
  //   };

  const acceptCall = () => {
    dispatch(OngoingVoiceCall({ ...incomingCall, callType: 'on_going' }));
    console.log({ IDDDD: incomingCall.id });
    socket.emit('accept-incoming-call', { id: incomingCall.id });
    dispatch(IncomingVoiceCalls(undefined));
  };

  const rejectCall = () => {
    socket.emit('reject-voice-call', { from: incomingCall.id });
    dispatch(EndCall());
  };
  return (
    <div className="absolute w-[400px] h-[200px] text-white gap-2 flex-col  flex justify-center items-center bg-black bottom-[100px] m-auto ">
      <Image
        src={incomingCall.avatar}
        alt='"avatar'
        width={70}
        height={70}
        className="rounded-full"
      />
      <div>{incomingCall.displayName}</div>
      <div className="text-xs ">Incoming Voice Call</div>
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

export default IncomingVoiceCall;
