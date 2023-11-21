'use client';
import { Avatar } from '@mui/material';
import { BsThreeDotsVertical, BiSearch } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { HiSearch } from 'react-icons/hi';
import { MdCall } from 'react-icons/md';
import { FaVideo } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import SearchBar from './SearchMessages';
import { useDispatch } from 'react-redux';
import { SearchMessages } from '@/reduxReducers/Reducers';
import { currentUser } from '@/reduxReducers/Reducers';
const ChatHeader = ({ HandleVoiceCall, HandleVideoCall }) => {
  const { currentChat, Search, onlineUsers } = useSelector(
    (state) => state.User
  );
  const [IsOnline, setIsOnline] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const onlineUse = onlineUsers?.includes(currentChat._id);
    setIsOnline(onlineUse);
  }, [onlineUsers, currentChat]);
  const ExitChat = () => {
    dispatch(currentUser(undefined));
  };
  return (
    <div className="w-full min-h-[10%] p-2 text-gray-500 flex items-center justify-between bg-slate-200 ">
      <div className="w-[25%] p-3 flex items-center justify-between ">
        <Avatar
          src={currentChat.avatar}
          sx={{ width: '60px', height: '60px' }}
        />
        <div className="flex flex-col gap-1">
          <h1 className="text-[20px]">{currentChat.displayName}</h1>
          <div className="flex gap-2 items-center">
            {IsOnline && (
              <div className="w-[10px] h-[10px] rounded-full bg-[#08764e]" />
            )}
            <h1> {IsOnline ? 'Online' : 'offline'}</h1>
          </div>
        </div>
      </div>
      <div className="w-[25%] p-3 flex items-center justify-between ">
        <MdCall
          onClick={HandleVoiceCall}
          title="Voice Call"
          className="w-[30px] h-[30px] cursor-pointer"
        />
        <FaVideo
          onClick={HandleVideoCall}
          title="video"
          className="w-[30px] h-[30px] cursor-pointer"
        />
        <HiSearch
          onClick={() => {
            dispatch(SearchMessages(true));
          }}
          className="w-[30px] h-[30px] cursor-pointer"
        />
        <BsThreeDotsVertical
          title="exit chat"
          className="w-[30px] h-[30px] cursor-pointer"
          onClick={ExitChat}
        />
      </div>
    </div>
  );
};

export default ChatHeader;
