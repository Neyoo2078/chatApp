'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { EndVCall as EndCall } from '@/Redux/Slices/Calls';
import axios from 'axios';

import {
  IncomingVoiceCall as IncomingVoiceCalls,
  OngoingVoiceCall as OngoingVoiceCalls,
} from '@/Redux/Slices/Calls';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';

const OngoingVoiceCall = () => {
  const dispatch = useAppDispatch();
  const [Token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);

  console.log({ Token, zgVar });
  // useSelector
  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );
  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );

  const {
    outgoingCall,
    incomingCall,
    ongoingVoiceCall: data,
  } = useAppSelector((state) => state.Calls);

  const getToken = async () => {
    try {
      const { data: token } = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/generate/token/${currentUser._id}`
      );

      setToken(token);
    } catch (error) {
      console.log(error);
    }
  };

  const StartCall = async () => {
    import('zego-express-engine-webrtc').then(async ({ ZegoExpressEngine }) => {
      const zg = new ZegoExpressEngine(
        parseInt(process.env.ZEGOAPP_ID),
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
            dispatch(EndCall());
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
      zg.startPublishingStream(streamID.toString(), localStreams);
    });
  };

  useEffect(() => {
    getToken();
  }, [data]);
  useEffect(() => {
    if (Token) {
      StartCall();
    }
  }, [Token]);

  const EndCalls = () => {
    console.log('end');
    dispatch(EndCall());
    socket.emit('end_call', { to: data.id });

    zgVar?.destroyStream(localStream);
    zgVar?.stopPublishingStream(publishStream);
    zgVar?.logoutRoom(data.roomId);
  };
  return (
    <div className="w-full text-white bg-chat-bg h-screen flex gap-3 flex-col items-center justify-center">
      <div className=" flex flex-col w-full items-center justify-center">
        {data.callType === 'on_going' && (
          <div className="my-15">
            <Image src={data.avatar} width={120} height={120} alt='"avatar' />
          </div>
        )}
        <div className="my-5 relative" id="remote-video">
          <div className="absolute bottom-5 right-5" id="local-audio"></div>
        </div>
        <h1 className="text-[40px] text-black">{data.displayName}</h1>
        <h1 className="text-[20px] text-black">
          {data.callType !== 'audio' ? 'on going' : 'Calling'}
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

export default OngoingVoiceCall;
