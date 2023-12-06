'use client';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { addAllUsers } from '@/lib/Actions/UserActions';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import { ActiveChat } from '@/Redux/Slices/Users';
import { IoMdArrowBack } from 'react-icons/io';
import dateFormat, { masks } from 'dateformat';
import { IoVideocamOutline, IoCallOutline } from 'react-icons/io5';
import { LuSearch } from 'react-icons/lu';
import { CiFaceSmile, CiMicrophoneOn } from 'react-icons/ci';
import { TiAttachment } from 'react-icons/ti';
import { VscSend } from 'react-icons/vsc';
import { BsDot } from 'react-icons/bs';
import axios from 'axios';
import { Formik, useFormik } from 'formik';
import { CreateDbMessage } from '@/lib/Actions/MessageActions';
import { ChatWithActiveUser } from '@/lib/Actions/MessageActions';
import PhotoPicker from '@/components/PhotoPicker';
import {
  OutGoingVCall,
  IncomingVoiceCall,
  updateVideoCall,
  IncomingVideoCall as IncomingVideoCalls,
  OngoingVideoCall as OngoingVideoCalls,
} from '@/Redux/Slices/Calls';
import {
  DbActiveMessages,
  UpdateActiveMessages,
} from '@/Redux/Slices/Messages';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { useSocket } from '@/providers/socket-provider';
import { usePathname } from 'next/navigation';
import { revPath } from '@/lib/Actions/MessageActions';
import EmojiPicker from '@/components/EmojiPickers';
import { ChangeEvent } from 'react';
import AudioMessage from '@/components/AudioMessage';
import {
  EndVCall,
  updateVoiceCall,
  OutGoingVideoCall,
} from '@/Redux/Slices/Calls';
import VoiceCall from '@/components/VoiceCall';
import IncomingVoiceCalls from '@/components/IncomingVoiceCall';
import OngoingVoiceCall from '@/components/OngoingVoiceCall';
import IncomingVideoCall from '@/components/IncomingVideoCall';
import VideoCall from '@/components/VideoCall';
import { EndVideoCall } from '@/Redux/Slices/Calls';
import OngoingVideoCall from '@/components/OngoingVideoCall';

export default function Home() {
  // useState instances
  const [messagescroll, setmessagescroll] = useState('');
  const [openEmoji, setopenEmoji] = useState(false);
  const [addComment, setaddComment] = useState('');
  const [PhotoMsg, setPhotoMsg] = useState(false);
  const [audioMessage, setaudioMessage] = useState(false);

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
    ongoingVoiceCall,
    outgoingVideoCall,
    incomingvideoCall,
    ongoingVideoCall,
  } = useAppSelector((state) => state.Calls);
  const { zgVar, localStream, publishStream, roomId } = useAppSelector(
    (state) => state.Zego
  );

  console.log({ PagezgVar: zgVar, localStream, publishStream, roomId });

  const photoPickChange = async (e: ChangeEvent<HTMLInputElement>) => {
    console.log('we enter function');
    const file = e.target.files?.[0];

    if (file) {
      const formdata = new FormData();
      formdata.append('image', file);

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SITE_URL}/image/add-image-message/?from=${activeChat?._id}&to=${currentUser?._id}`,
          formdata,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        const ress = await CreateDbMessage({
          senderId: currentUser?._id,
          receiverId: activeChat?._id,
          message: res.data?.message,
          path: pathname,
          messageType: 'image',
          messageStatus: 'sent',
        });

        // dispatch the message to current user
        if (onlineUser?.onlineUser?.includes(activeChat?._id)) {
          dispatch(
            UpdateActiveMessages({
              ...JSON.parse(ress),
              messageStatus: 'delivered',
            })
          );
        } else {
          dispatch(UpdateActiveMessages(JSON.parse(ress)));
        }
        // send through socket if the reciever is online
        socket?.emit('send_msg', JSON.parse(ress));
      } catch (error) {
        console.log(error);
      }
    }
  };

  // refs
  const messageScroll = useRef<HTMLDivElement>(null);
  const messageS = useRef<HTMLDivElement>(null);

  // status can be loading aunthenticated ununthenticated
  const { data: session, status } = useSession();
  const route = useRouter();
  const pathname = usePathname();

  // initiate Dispatch
  const dispatch = useAppDispatch();

  const getChatWithActiveUser = async () => {
    const res = await ChatWithActiveUser({
      currentUser: currentUser?._id,
      ActiveChat: activeChat?._id,
    });
    dispatch(DbActiveMessages(JSON.parse(res)));
  };

  useEffect(() => {
    if (PhotoMsg) {
      const data = document.getElementById('photo-picker');
      data?.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setPhotoMsg(false);
        }, 1000);
      };
    }
  }, [PhotoMsg]);

  useEffect(() => {
    setTimeout(() => {
      const scrollContainer = messageS.current;
      const ss = messageScroll.current;
      if (ss) {
        ss.scrollIntoView({ behavior: 'smooth' });
      }
    }, 1000);
  }, [activeMessages]);

  useEffect(() => {
    getChatWithActiveUser();
  }, [activeChat]);

  useEffect(() => {
    if (socket) {
      socket.on('recieve-msg', (data: any) => {
        const verifyData = data.senderId === activeChat?._id;
        if (verifyData) {
          dispatch(
            UpdateActiveMessages({
              senderId: data.senderId,
              message: data.message,
              messageStatus: 'read',
              messageType: data.messageType,
            })
          );
        } else {
          dispatch(
            UpdateActiveMessages({
              senderId: data.senderId,
              message: data.message,
              messageStatus: 'delivered',
              messageType: data.messageType,
            })
          );
        }
        revPath();
      });
    }
  }, [socket]);
  // date
  masks.hammerTime = 'HH:MM';

  // 17:46! Can't touch this!
  // FORMIK

  const handleSubmit = async () => {
    const res = await CreateDbMessage({
      senderId: currentUser?._id,
      receiverId: activeChat?._id,
      message: addComment,
      path: pathname,
      messageType: 'text',
      messageStatus: 'sent',
    });
    setaddComment('');

    // dispatch the message to current user
    if (onlineUser?.onlineUser?.includes(activeChat?._id)) {
      dispatch(
        UpdateActiveMessages({
          ...JSON.parse(res),
          messageStatus: 'delivered',
        })
      );
    } else {
      dispatch(UpdateActiveMessages(JSON.parse(res)));
    }

    // send through socket if the reciever is online
    socket?.emit('send_msg', JSON.parse(res));
  };
  useEffect(() => {
    socket?.on('incoming_voice_call', ({ from, roomId, callType }: any) => {
      dispatch(IncomingVoiceCall({ ...from, roomId, callType }));
    });
  }, [socket]);
  useEffect(() => {
    socket?.on('incoming_video_call', ({ from, roomId, callType }: any) => {
      dispatch(IncomingVideoCalls({ ...from, roomId, callType }));
    });
  }, [socket]);

  socket?.on('end_voice_call', () => {
    dispatch(EndVCall(null));
  });

  socket?.on('end_video_call', () => {
    if (zgVar && localStream && publishStream && roomId) {
      console.log('weeeeeeeeeeeeeeeeeeeee');
      zgVar?.destroyStream(localStream);
      zgVar?.stopPublishingStream(publishStream);
      zgVar?.logoutRoom(roomId);
      dispatch(EndVideoCall(null));
    }
  });
  socket?.on('voice_call_rejected', () => {
    dispatch(EndVCall(null));
  });
  socket?.on('accept-call', () => {
    console.log('call accepted');
    dispatch(updateVoiceCall({ ...outgoingCall, callType: 'on_going' }));
  });
  socket?.on('accept-Vcall', () => {
    dispatch(updateVideoCall({ ...outgoingVideoCall, callType: 'on_going' }));
  });
  socket?.on('video_call_rejected', () => {
    dispatch(EndVideoCall(''));
  });

  const HandleOutgoingVoiceCall = () => {
    if (!outgoingVideoCall || ongoingVideoCall) {
      dispatch(
        OutGoingVCall({
          ...activeChat,
          type: 'voice',
          callType: 'out-going',
          roomId: Date.now(),
        })
      );
    }
  };
  console.log({ ongoingVoiceCall });

  const HandleOutgoingVideoCall = () => {
    if (!outgoingCall || ongoingVoiceCall) {
      dispatch(
        OutGoingVideoCall({
          ...activeChat,
          type: 'out-going',
          callType: 'video',
          roomId: Date.now(),
        })
      );
    }
  };

  if (!session) {
    return (
      <button
        className=" hidden md:block"
        onClick={() => {
          signIn(undefined, { callbackUrl: '/' });
        }}
      >
        Sign in
      </button>
    );
  }
  if (!activeChat) {
    return (
      <main className="lg:flex min-h-screen bg-chat-plain w-full  hidden flex-col   ">
        <div className="flex justify-center items-center flex-col mt-[200px]">
          <Image src={'/splash.png'} alt="logo" width={140} height={140} />
          <h1 className="text-[20px] font-[600]">WhatsApp Created By Neyoo</h1>
        </div>
      </main>
    );
  }
  if (activeChat) {
    return (
      <main
        className={`lg:flex h-screen bg-chat-bg relative w-full overflow-y-hidden ${
          activeChat ? 'flex' : 'hidden'
        } flex-col items-center gap-0  `}
      >
        <div className="w-full h-[10%] border-[1px] items-center flex justify-between border-t-[1px] border-b-[1px] px-7 py-3 border-[#b4b4b4] bg-[#FAF9F6]">
          <IoMdArrowBack
            onClick={() => {
              dispatch(ActiveChat(null));
            }}
            className="md:hidden w-[25px] h-[25px]"
          />
          <div className="flex items-center gap-3">
            <Image
              src={activeChat.avatar}
              alt="profile-picture"
              width={50}
              height={50}
            />{' '}
            <h1>{activeChat.displayName}</h1>
          </div>
          <div className="flex gap-2 items-center">
            {onlineUser?.onlineUser.includes(activeChat._id) && (
              <div className="flex gap-1 items-center justify-center">
                <h1 className="md:block hidden">online</h1>
                <BsDot className="text-[#37d072] w-[25px] h-[25px]" />
              </div>
            )}
            <div className="flex w-[90px] md:w-[120px] justify-around border-[1px] ">
              <div
                title="Video Call"
                className="w-[50%] hover:bg-[#a1a1a1] h-full p-4"
              >
                <IoVideocamOutline
                  onClick={HandleOutgoingVideoCall}
                  className="w-[20px] h-[20px] mx-auto "
                />
              </div>
              <div
                title="Voice Call"
                className="w-[50%] hover:bg-[#a1a1a1] h-full p-4"
              >
                <IoCallOutline
                  onClick={HandleOutgoingVoiceCall}
                  className="w-[20px] h-[20px] mx-auto"
                />
              </div>
            </div>
            <LuSearch />
          </div>
        </div>
        {/* outgoing call */}

        {outgoingCall && (
          <VoiceCall />
          // <div className="absolute w-[50%] h-[65%] bg-black top-[40px]"></div>
        )}
        {incomingCall && (
          <IncomingVoiceCalls />
          // <div className="absolute w-[50%] h-[65%] bg-black top-[40px]"></div>
        )}
        {ongoingVoiceCall && <OngoingVoiceCall />}
        {outgoingVideoCall && <VideoCall />}
        {incomingvideoCall && <IncomingVideoCall />}
        {ongoingVideoCall && <OngoingVideoCall />}
        {/* incoming call
        {incomingCall && (
          <div className="absolute w-[50%] h-[65%] bg-black top-[40px]"></div>
        )} */}
        <div
          ref={messageS}
          className=" px-5 h-[84%] py-3 overflow-y-scroll border-[#7e2b2b]  w-full items-start justify-start font-mono text-sm flex flex-col"
        >
          {activeMessages?.length > 0 && (
            <div className="w-full  flex flex-col m-0  gap-3 items-start justify-start ">
              {activeMessages.map((items: any, i: number) => (
                <div
                  className={`w-full flex   ${
                    currentUser._id === items.senderId &&
                    'text-right  justify-end'
                  }  `}
                  key={i}
                >
                  <div className="bg-[#D9FDD3] flex-col flex gap-2 justify-between rounded-lg p-3 max-w-md">
                    {items.message}
                    <div className="w-full flex justify-end">
                      <div className="flex gap-1 items-center">
                        {' '}
                        <h1 className="text-[10px]">
                          {dateFormat(items.createdAt, 'hammerTime')}
                        </h1>
                        {items.senderId === currentUser?._id && (
                          <div>
                            {items.messageStatus === 'sent' && <BsCheck2 />}
                            {items.messageStatus === 'delivered' && (
                              <BsCheck2All />
                            )}
                            {items.messageStatus === 'read' && (
                              <BsCheck2All className="text-[#56e8b5]" />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messageScroll} className="w-full h-[20px] "></div>
            </div>
          )}
        </div>
        {openEmoji && (
          <EmojiPicker
            openEmoji={openEmoji}
            setopenEmoji={setopenEmoji}
            setaddComment={setaddComment}
          />
        )}
        {PhotoMsg && <PhotoPicker change={photoPickChange} />}
        {audioMessage && <AudioMessage hide={setaudioMessage} />}
        {!audioMessage && (
          <div className="w-full h-[8%] bottom-0 absolute items-center flex justify-evenly md:justify-between border-t-[1px] border-b-[1px] px-5 md:px-7 py-3 border-[#b4b4b4] bg-[#FAF9F6]">
            <div className="flex gap-3">
              <CiFaceSmile
                onClick={() => {
                  setopenEmoji(true);
                }}
                className="text-[#5d5c5c] hidden md:block w-[25px] h-[25px] font-[200]"
              />
              <TiAttachment
                onClick={() => {
                  setPhotoMsg(true);
                }}
                className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]"
              />
            </div>
            <div className="w-[80%]">
              <input
                className="w-full bg-transparent outline-none"
                placeholder="Type a message"
                autoComplete="off"
                value={addComment}
                onChange={(e) => {
                  setaddComment(e.target.value);
                }}
              />
            </div>
            <div className="flex gap-3 items-center ">
              {addComment.length === 0 && (
                <CiMicrophoneOn
                  onClick={() => {
                    setaudioMessage(true);
                  }}
                  className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]"
                />
              )}
              <VscSend
                onClick={handleSubmit}
                className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]"
              />
            </div>
          </div>
        )}
      </main>
    );
  }
}
