'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { EndVCall } from '@/Redux/Slices/Calls';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';

const VoiceCall = () => {
  const dispatch = useAppDispatch();
  const [CallAccepted, setCallAccepted] = useState(false);
  const [Token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);

  // useSelector
  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );
  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );

  const { outgoingCall: data, incomingCall } = useAppSelector(
    (state) => state.Calls
  );

  const getToken = async () => {
    try {
      const { data: token } = await axios.get(
        `/generate/token/${currentUser._id}`
      );
      console.log({ token });
      setToken(token);
    } catch (error) {
      console.log(error);
    }
  };

  const StartCall = async () => {
    import('zego-express-engine-webrtc').then(async ({ ZegoExpressEngine }) => {
      const zg = new ZegoExpressEngine(
        process.env.ZEGO_APP_ID,
        process.env.ZEGO_SERVER_SECRET
      );
      setzgVar(zg);
      zg.on(
        'roomStreamUpdate',
        async (roomID, updateType, streamList, extendedData) => {
          if (updateType === 'ADD') {
            const rmVideo = document.getElementById('remote-video');
            const ad = document.createElement('audio');
            ad.id = streamList[0].streamID;
            ad.autoplay = true;
            ad.playsInline = true;
            ad.muted = false;
            if (rmVideo) {
              rmVideo.appendChild(ad);
            }
            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
            }).then((stream) => {
              ad.srcObject = stream;
            });
          } else if (
            updateType === 'DELETE' &&
            zg &&
            localStream &&
            streamList[0].streamID
          ) {
            zg.destroyStream(localStream);
            zg.stopPublishingStream(streamList[0].streamID);
            zg.logoutRoom(data.roomId);
            dispatch(EndVCall());
          }
        }
      );

      await zg.loginRoom(
        data.roomId.toString(),
        Token,
        {
          userID: currentUser._id.toString(),
          userName: currentUser.displayName,
        },
        { userUpdate: true }
      );
      const localStreams = await zg.createStream({
        camera: {
          audio: true,
        },
      });

      const localVideo = document.getElementById('local-audio');
      const ad = document.createElement('audio');
      ad.id = 'video_local_zego';
      ad.className = 'h-28 w-32';
      ad.autoplay = true;
      ad.muted = false;
      ad.playsInline = true;
      localVideo.appendChild(ad);
      const td = document.getElementById('video_local_zego');
      td.srcObject = localStreams;
      const streamID = 123 + Date.now();
      setpublishStream(streamID);
      zg.startPublishingStream(streamID, localStreams);
    });
  };

  useEffect(() => {
    if (data.callType === 'on_going') {
      getToken();
    }
  }, [data]);
  useEffect(() => {
    if (Token) {
      StartCall();
    }
  }, [Token]);

  useEffect(() => {
    socket?.emit('outgoing-voice-call', {
      to: data._id,
      from: {
        id: currentUser._id,
        avatar: currentUser.avatar,
        displayName: currentUser.displayName,
      },
      callType: data.callType,
      roomId: data.roomId,
    });
  }, []);

  const EndCalls = () => {
    dispatch(EndVCall(null));

    socket?.emit('end_call', {
      to: data._id,
      from: {
        id: currentUser._id,
        avatar: currentUser.avatar,
        displayName: currentUser.displayName,
      },
      callType: data.callType,
      roomId: data.roomId,
    });

    if (data.callType === 'on_going' && zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId);
    }
  };

  return (
    <div className="absolute w-[50%] h-[65%] flex   flex-col justify-center items-center bg-black bg-black-bg top-[40px] bg-contain">
      <div className="my-15">
        <Image src={data.avatar} width={120} height={120} alt='"avatar' />
      </div>
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-audio"></div>
      </div>
      <div className=" flex flex-col w-full items-center justify-center">
        <h1 className="text-[40px] text-white">{data.displayName}</h1>
        <h1 className="text-[20px] text-white">
          {data.callType === 'on_going' ? 'on going Call' : 'Calling...'}
        </h1>
      </div>

      <div
        onClick={EndCalls}
        className="bg-[#e31a1a] cursor-pointer w-[50px] h-[50px] flex mt-[60px] items-center rounded-full "
      >
        <MdOutlineCallEnd className="w-[45px] h-[45px] m-auto text-white" />
      </div>
    </div>
  );
};

export default VoiceCall;
