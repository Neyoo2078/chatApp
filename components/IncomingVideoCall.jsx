import { useSelector } from 'react-redux';
import Image from 'next/image';
import { SetOngoingVideoCall } from '@/reduxReducers/Reducers';
import { SetIncomingVideoCall } from '@/reduxReducers/Reducers';
import { useDispatch } from 'react-redux';
import { EndCall } from '@/reduxReducers/Reducers';

const IncomingVideoCall = () => {
  const dispatch = useDispatch();
  const { incomingVideoCall, Socketinfo } = useSelector((state) => state.User);
  console.log({ incomingVideoCall });
  const acceptCall = () => {
    dispatch(
      SetOngoingVideoCall({ ...incomingVideoCall, callType: 'in-coming' })
    );
    Socketinfo.emit('accept-incoming-Vcall', { id: incomingVideoCall.id });
    dispatch(SetIncomingVideoCall(undefined));
  };

  const rejectCall = () => {
    Socketinfo.emit('reject-voice-call', { from: incomingVideoCall.id });
    dispatch(EndCall());
  };
  return (
    <div className="absolute w-[400px] h-[200px] text-white gap-2 flex-col  flex justify-center items-center bg-black bottom-[100px] m-auto ">
      <Image
        src={incomingVideoCall.avatar}
        alt='"avatar'
        width={70}
        height={70}
        className="rounded-full"
      />
      <div>{incomingVideoCall.displayName}</div>
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
