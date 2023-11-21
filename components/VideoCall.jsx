'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { EndCall } from '@/reduxReducers/Reducers';
import { useSelector } from 'react-redux';
import axios from 'axios';
const VideoCall = () => {
  const [CallAccepted, setCallAccepted] = useState(false);
  const [Token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);
  console.log({ zgVar, Token });
  console.log(Token);
  const dispatch = useDispatch();

  const {
    Socketinfo,
    videoCall: data,
    ReducerSesiion,
  } = useSelector((state) => state.User);

  const getToken = async () => {
    try {
      const { data: tokens } = await axios.get(
        `${process.env.BaseUrl}/generate/token/${ReducerSesiion._id}`
      );

      setToken(tokens);
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
            const vd = document.createElement('video');
            vd.id = streamList[0].streamID;
            vd.autoplay = true;
            vd.playsInline = true;
            vd.muted = false;
            if (rmVideo) {
              rmVideo.appendChild(vd);
            }
            zg.startPlayingStream(streamList[0].streamID, {
              audio: true,
              video: true,
            }).then((stream) => {
              vd.srcObject = stream;
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

      // For this user video
      const localStreams = await zg.createStream({
        camera: {
          audio: true,
          video: true,
        },
      });

      const localVideo = document.getElementById('local-audio');
      const vd = document.createElement('video');
      vd.id = 'video_local_zego';
      vd.className = 'h-28 w-32';
      vd.autoplay = true;
      vd.muted = false;
      vd.playsInline = true;
      localVideo.appendChild(vd);
      const td = document.getElementById('video_local_zego');
      td.srcObject = localStreams;
      const streamID = 123 + Date.now().toString();
      setpublishStream(streamID);
      setlocalStream(localStreams);
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
    Socketinfo?.emit('outgoing-video-call', {
      to: data._id,
      from: {
        id: ReducerSesiion._id,
        avatar: ReducerSesiion.avatar,
        displayName: ReducerSesiion.displayName,
      },
      callType: data.callType,
      roomId: data.roomId,
    });
  }, []);

  const EndCalls = () => {
    console.log({ type: data.callType, zgVar, localStream, publishStream });
    if (data.callType === 'on_going' && zgVar && localStream && publishStream) {
      console.log('we entered');
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }

    dispatch(EndCall());

    Socketinfo?.emit('end_call', {
      to: data._id,
      from: {
        id: ReducerSesiion._id,
        avatar: ReducerSesiion.avatar,
        displayName: ReducerSesiion.displayName,
      },
      callType: data.callType,
      roomId: data.roomId,
    });
  };
  return (
    <div className="w-full text-white bg-chat-bg h-screen flex gap-3 flex-col items-center justify-center">
      <div className=" flex flex-col w-full items-center justify-center">
        <div className="my-15">
          <Image src={data.avatar} width={120} height={120} alt='"avatar' />
        </div>
        <div className="my-5 relative w-full h-full" id="remote-video">
          <div className="absolute bottom-5 right-5" id="local-audio"></div>
        </div>
        <h1 className="text-[40px] text-black">{data.displayName}</h1>
        <h1 className="text-[20px] text-black">
          {data.callType === 'on_going' ? 'on going V. Call' : 'Calling'}
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

export default VideoCall;
