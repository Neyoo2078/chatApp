'use client';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ChatMessage } from '@/reduxReducers/Reducers';
import dateFormat, { masks } from 'dateformat';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import { UpdateChatMessage } from '@/reduxReducers/Reducers';
import io from 'socket.io-client';
import { SocketReducer } from '@/reduxReducers/Reducers';
import ImageMessages from './ImageMessages';
import VoiceMessage from './VoiceMessage';
import { SetIncomingVideoCall } from '@/reduxReducers/Reducers';
import { SetIncomingVoiceCall } from '@/reduxReducers/Reducers';
import { EndCall } from '@/reduxReducers/Reducers';
import { SetVideoCall } from '@/reduxReducers/Reducers';
import { SetVoiceCall } from '@/reduxReducers/Reducers';
import { updateVoiceCall } from '@/reduxReducers/Reducers';
import { updateVideoCall } from '@/reduxReducers/Reducers';
const ChatContainer = ({ user }) => {
  const { data: session, status } = useSession();
  const { currentChat, ChatMessages, handleEmojiModal, voiceCall, Socketinfo } =
    useSelector((state) => state.User);

  const [Chat, setChat] = useState(null);

  const dispatch = useDispatch();

  const userMessages = async () => {
    try {
      setChat(null);
      dispatch(ChatMessage([]));
      const res = await fetch(
        `/api/message/${currentChat._id}/${session?.user.id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      dispatch(ChatMessage(data));
      setChat(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    userMessages();
  }, [currentChat]);

  Socketinfo?.on('recieve-msg', (data) => {
    dispatch(
      UpdateChatMessage({
        senderId: data.senderId,
        message: data.message,
        messageStatus: 'read',
        messageType: data.messageType,
      })
    );
  });

  // date
  masks.hammerTime = 'HH:MM';

  // 17:46! Can't touch this!

  return (
    <div
      // h-[80%] without emoji
      className={` ${
        handleEmojiModal && 'h-[40%]'
      }  h-[80%] w-full flex flex-col p-10  overflow-auto custom-scrollbar bg-chat-bg`}
    >
      {ChatMessages?.map((items, i) => (
        <div
          key={i}
          className={`${
            session?.user.id === items.senderId
              ? 'justify-end'
              : 'justify-start'
          } text-black  text-[16px]   p-2 flex  `}
        >
          {items.messageType === 'text' && (
            <div className="bg-[#D9FDD3] flex gap-2 justify-between rounded-lg p-4 max-w-md">
              <h1 className="text-[16px]"> {items.message}</h1>
              <div className="flex items-end gap-2 justify-between">
                {' '}
                <h1 className="text-[10px]">
                  {dateFormat(items.createdAt, 'hammerTime')}
                </h1>
                {items.senderId === session?.user.id && (
                  <div>
                    {items.messageStatus === 'sent' && <BsCheck2 />}
                    {items.messageStatus === 'delivered' && <BsCheck2All />}
                    {items.messageStatus === 'read' && (
                      <BsCheck2All className="text-[#56e8b5]" />
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {items.messageType === 'image' && (
            <ImageMessages items={items} i={i} />
          )}
          {items.messageType === 'audio' && (
            <VoiceMessage items={items} i={i} user={user} />
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatContainer;
