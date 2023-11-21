'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { EndCall } from '@/reduxReducers/Reducers';
import { useSelector } from 'react-redux';
import axios from 'axios';
const OngoingVoiceCall = () => {
  const dispatch = useDispatch();
  const [Token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);

  const { Socketinfo, OngoingVoiceCall } = useSelector((state) => state.User);

  const getToken = async () => {
    try {
      const { data: token } = await axios.get(
        `/generate/token/${ReducerSesiion._id}`
      );

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
            dispatch(EndCall());
          }
        }
      );
      await zg.loginRoom(
        data.roomId.toString(),
        Token,
        {
          userID: ReducerSesiion._id.toString(),
          userName: ReducerSesiion.displayName,
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

  const EndCalls = () => {
    dispatch(EndCall());
    Socketinfo.emit('end_call', { to: OngoingVoiceCall.id });

    zgVar.destroyStream(localStream);
    zgVar.stopPublishingStream(publishStream);
    zgVar.logoutRoom(data.roomId);
  };
  return (
    <div className="w-full text-white bg-chat-bg h-screen flex gap-3 flex-col items-center justify-center">
      <div className=" flex flex-col w-full items-center justify-center">
        {OngoingVoiceCall.callType === 'in-coming' && (
          <div className="my-15">
            <Image
              src={OngoingVoiceCall.avatar}
              width={120}
              height={120}
              alt='"avatar'
            />
          </div>
        )}
        <h1 className="text-[40px] text-black">
          {OngoingVoiceCall.displayName}
        </h1>
        <h1 className="text-[20px] text-black">
          {OngoingVoiceCall.callType !== 'audio' ? 'on going' : 'Calling'}
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
