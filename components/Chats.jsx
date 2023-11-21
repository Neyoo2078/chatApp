'use client';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import MessageBar from './MessageBar';
import EmojiPicker from './emojiPicker';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import SearchContainer from './SearchContainer';
import { useDispatch } from 'react-redux';
import { SetVoiceCall } from '@/reduxReducers/Reducers';
import { SetVideoCall } from '@/reduxReducers/Reducers';

const Chat = () => {
  const [message, setmessage] = useState('');
  const emojiBox = useRef();

  const dispatch = useDispatch();
  const {
    ReducerSesiion: user,
    Search,
    currentChat,
  } = useSelector((state) => state.User);

  const HandleVoiceCall = () => {
    dispatch(
      SetVoiceCall({
        ...currentChat,
        type: 'out-going',
        callType: 'voice',
        roomId: Date.now(),
      })
    );
  };

  const HandleVideoCall = () => {
    dispatch(
      SetVideoCall({
        ...currentChat,
        type: 'out-going',
        callType: 'video',
        roomId: Date.now(),
      })
    );
  };
  return (
    <div className="w-full flex flex-col h-screen  text-white border-[1px]">
      {!Search && (
        <ChatHeader
          HandleVideoCall={HandleVideoCall}
          HandleVoiceCall={HandleVoiceCall}
        />
      )}
      {Search ? <SearchContainer /> : <ChatContainer user={user} />}

      <EmojiPicker
        emojiBox={emojiBox}
        message={message}
        setmessage={setmessage}
      />
      {!Search && (
        <MessageBar
          emojiBox={emojiBox}
          message={message}
          setmessage={setmessage}
        />
      )}
    </div>
  );
};

export default Chat;
