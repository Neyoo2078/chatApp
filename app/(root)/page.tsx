'use client';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { addAllUsers } from '@/lib/Actions/UserActions';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import { ActiveChat } from '@/Redux/Slices/Users';
import dateFormat, { masks } from 'dateformat';
import { IoVideocamOutline, IoCallOutline } from 'react-icons/io5';
import { LuSearch } from 'react-icons/lu';
import { CiFaceSmile, CiMicrophoneOn } from 'react-icons/ci';
import { TiAttachment } from 'react-icons/ti';
import { VscSend } from 'react-icons/vsc';
import { BsDot } from 'react-icons/bs';
import { useFormik } from 'formik';
import { CreateDbMessage } from '@/lib/Actions/MessageActions';
import { ChatWithActiveUser } from '@/lib/Actions/MessageActions';
import {
  DbActiveMessages,
  UpdateActiveMessages,
} from '@/Redux/Slices/Messages';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { useSocket } from '@/providers/socket-provider';

export default function Home() {
  // useState instances
  const [messagescroll, setmessagescroll] = useState('');

  // refs
  const messageScroll = useRef<HTMLDivElement>(null);
  const messageS = useRef<HTMLDivElement>(null);

  // const scrollContainer = messageS.current;
  // console.log(scrollContainer?.scrollHeight);
  // console.log(scrollContainer?.clientHeight);
  const { isConnected, socket } = useSocket();

  console.log({ Pp: messageScroll });

  // status can be loading aunthenticated ununthenticated
  const { data: session, status } = useSession();
  const route = useRouter();
  // initiate Dispatch
  const dispatch = useAppDispatch();

  // useSelector
  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );
  const { activeMessages, sockett } = useAppSelector((state) => state.Messages);
  console.log({ sockett });

  const getChatWithActiveUser = async () => {
    const res = await ChatWithActiveUser({
      currentUser: currentUser?._id,
      ActiveChat: activeChat?._id,
    });
    dispatch(DbActiveMessages(JSON.parse(res)));
    // setTimeout(() => {
    //   const scrollContainer = messageS.current;
    //   const ss = messageScroll.current;
    //   if (ss) {
    //     ss.scrollIntoView({ behavior: 'smooth' });
    //   }
    // }, 1000);
  };
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
        console.log('we recieving');
        dispatch(UpdateActiveMessages(data));
      });
    }
  }, [socket]);
  // date
  masks.hammerTime = 'HH:MM';

  // 17:46! Can't touch this!
  // FORMIK
  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async (values) => {
      const res = await CreateDbMessage({
        senderId: currentUser?._id,
        receiverId: activeChat?._id,
        message: values.message,
      });
      values.message = '';
      // dispatch the message to current user
      dispatch(UpdateActiveMessages(JSON.parse(res)));

      // send through socket if the reciever is online
      socket.emit('send_msg', JSON.parse(res));

      // if (scrollContainer) {
      //   const scrollHeight = scrollContainer.scrollHeight;
      //   const containerHeight = scrollContainer.clientHeight;
      //   const maxScrollTop = scrollHeight - containerHeight;
      //   scrollContainer.scrollTop = maxScrollTop;
      // }

      // scrollToLastMessage
      // messageScroll?.current?.scrollIntoView({ behavior: 'smooth' });
      // messageScroll?.current?.scrollTop = 200;
      // messageS?.current?.scrollTo({
      //   behavior: 'smooth',
      //   top: messageScroll?.current?.offsetTop,
      // });
    },
  });

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
      <main className="lg:flex h-screen bg-chat-bg w-full overflow-y-hidden hidden flex-col items-center gap-0  ">
        <div className="w-full h-[80px] items-center flex justify-between border-t-[1px] border-b-[1px] px-7 py-3 border-[#b4b4b4] bg-[#FAF9F6]">
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
                <h1>online</h1>
                <BsDot className="text-[#37d072] w-[25px] h-[25px]" />
              </div>
            )}
            <div className="flex w-[120px] justify-around border-[1px] ">
              <div
                title="Video Call"
                className="w-[50%] hover:bg-[#a1a1a1] h-full p-4"
              >
                <IoVideocamOutline className="w-[20px] h-[20px] mx-auto " />
              </div>
              <div
                title="Voice Call"
                className="w-[50%] hover:bg-[#a1a1a1] h-full p-4"
              >
                <IoCallOutline className="w-[20px] h-[20px] mx-auto" />
              </div>
            </div>
            <LuSearch />
          </div>
        </div>
        <div
          ref={messageS}
          className=" px-5 h-[680px] py-3 overflow-y-scroll  w-full items-start justify-start font-mono text-sm flex flex-col"
        >
          {activeMessages?.length > 0 && (
            <div className="w-full h-full flex flex-col m-0  gap-3 items-start justify-start ">
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
        <div className="w-full h-[50px] items-center flex justify-between border-t-[1px] border-b-[1px] px-7 py-3 border-[#b4b4b4] bg-[#FAF9F6]">
          <div className="flex gap-3">
            <CiFaceSmile className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]" />
            <TiAttachment className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]" />
          </div>
          <div className="w-[80%]">
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Type a message"
              autoComplete="off"
              {...formik.getFieldProps('message')}
            />
          </div>
          <div className="flex gap-3 items-center ">
            <CiMicrophoneOn className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]" />
            <VscSend
              onClick={formik.handleSubmit}
              className="text-[#5d5c5c] w-[25px] h-[25px] font-[200]"
            />
          </div>
        </div>
      </main>
    );
  }
}
