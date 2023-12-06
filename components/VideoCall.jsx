'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { MdOutlineCallEnd } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { EndVCall, EndVideoCall } from '@/Redux/Slices/Calls';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from '@/Redux/hooks';

import {
  zgVars,
  localStreams as Lstreams,
  publishStreams,
  RoomIds,
} from '@/Redux/Slices/Zego';

const VideoCall = () => {
  const [CallAccepted, setCallAccepted] = useState(false);
  const [Token, setToken] = useState(undefined);
  const [zgVar, setzgVar] = useState(undefined);
  const [localStream, setlocalStream] = useState(undefined);
  const [publishStream, setpublishStream] = useState(undefined);
  console.log({ zgVar, Token, localStream, publishStream });
  console.log(Token);
  const dispatch = useAppDispatch();

  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );
  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );

  const { outgoingVideoCall: data, incomingCall } = useAppSelector(
    (state) => state.Calls
  );

  const getToken = async () => {
    try {
      const { data: tokens } = await axios.get(
        `${process.env.NEXT_PUBLIC_SITE_URL}/generate/token/${currentUser._id}`
      );

      setToken(tokens);
    } catch (error) {
      console.log(error);
    }
  };

  const EndCalls = () => {
    if (data.callType === 'on_going' && zgVar && localStream && publishStream) {
      zgVar?.destroyStream(localStream);
      zgVar?.stopPublishingStream(publishStream);
      zgVar?.logoutRoom(data.roomId.toString());
    }

    dispatch(EndVideoCall());

    socket?.emit('end_v_call', {
      to: data._id,
      from: {
        id: currentUser._id,
        avatar: currentUser.avatar,
        displayName: currentUser.displayName,
      },
      callType: data.callType,
      roomId: data.roomId,
    });
  };

  useEffect(() => {}, []);
  const StartCall = async () => {
    import('zego-express-engine-webrtc').then(async ({ ZegoExpressEngine }) => {
      const zg = new ZegoExpressEngine(
        parseInt(process.env.ZEGOAPP_ID),
        process.env.ZEGO_SERVER_SECRET
      );
      setzgVar(zg);
      dispatch(zgVars(zg));
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
            EndCalls();
          }
        }
      );
      dispatch(RoomIds(data.roomId.toString()));
      await zg.loginRoom(
        data.roomId.toString(),
        Token,
        {
          userID: currentUser._id.toString(),
          userName: currentUser.displayName,
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
      dispatch(publishStreams(streamID));
      dispatch(Lstreams(localStreams));

      zg.startPublishingStream(streamID.toString(), localStreams);
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
    socket?.emit('outgoing-video-call', {
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

  return (
    <div className="absolute w-[50%] h-[65%] flex   flex-col justify-center items-center bg-black bg-black-bg top-[40px] bg-contain">
      <div className=" flex flex-col w-full items-center justify-center">
        {!localStream && !publishStream && (
          <div className="my-15">
            <Image src={data.avatar} width={120} height={120} alt='"avatar' />
          </div>
        )}
        <div className="my-5 relative w-full h-full" id="remote-video">
          <div className="absolute bottom-5 right-5" id="local-audio"></div>
        </div>
        {!localStream && !publishStream && (
          <h1 className="text-[40px] text-white">{data.displayName}</h1>
        )}
        {!localStream && !publishStream && (
          <h1 className="text-[20px] text-white">
            {data.callType === 'on_going' ? 'on going V. Call' : 'Calling'}
          </h1>
        )}
      </div>

      <div
        onClick={EndCalls}
        className="bg-[#e31a1a] cursor-pointer w-[50px] h-[50px] flex mt-[30px] items-center rounded-full "
      >
        <MdOutlineCallEnd className="w-[45px] h-[45px] m-auto text-white" />
      </div>
    </div>
  );
};

export default VideoCall;
