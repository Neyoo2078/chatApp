'use client';
import React from 'react';
import Avatar from '@mui/material/Avatar';
import {
  BsFillChatLeftTextFill,
  BsThreeDotsVertical,
  BsFilter,
} from 'react-icons/bs';
import { IoIosPeople } from 'react-icons/io';
import { TbCircleDashed } from 'react-icons/tb';
import { HiSearch } from 'react-icons/hi';
import { headers } from 'next/dist/client/components/headers';
import { useState } from 'react';
import Contacts from './Contacts';
import { useSelector } from 'react-redux';
import ChatContacts from './ChatContacts';

const ChatList = ({ user }) => {
  const [IsChatListPage, setIsChatListPage] = useState(true);

  return (
    <div className="w-[25%] text-white gap-3 flex flex-col p-3">
      {IsChatListPage ? (
        <ChatContacts user={user} setIsChatListPage={setIsChatListPage} />
      ) : (
        <Contacts setIsChatListPage={setIsChatListPage} />
      )}
    </div>
  );
};

export default ChatList;
