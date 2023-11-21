'use client';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { SetVoiceCall } from '@/reduxReducers/Reducers';
import { SetIncomingVoiceCall } from '@/reduxReducers/Reducers';
import { EndCall } from '@/reduxReducers/Reducers';
import VoiceCall from './VoiceCall';
import { SetOngoingVoiceCall } from '@/reduxReducers/Reducers';

const IncomingVoiceCall = () => {
  const dispatch = useDispatch();
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
  const { incomingVoiceCall, Socketinfo } = useSelector((state) => state.User);
  const acceptCall = () => {
    dispatch(
      SetOngoingVoiceCall({ ...incomingVoiceCall, callType: 'in-coming' })
    );
    Socketinfo.emit('accept-incoming-call', { id: incomingVoiceCall.id });
    dispatch(SetIncomingVoiceCall(undefined));
  };

  const rejectCall = () => {
    Socketinfo.emit('reject-voice-call', { from: incomingVoiceCall.id });
    dispatch(EndCall());
  };
  return (
    <div className="absolute w-[400px] h-[200px] text-white gap-2 flex-col  flex justify-center items-center bg-black bottom-[100px] m-auto ">
      <Image
        src={incomingVoiceCall.avatar}
        alt='"avatar'
        width={70}
        height={70}
        className="rounded-full"
      />
      <div>{incomingVoiceCall.displayName}</div>
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
