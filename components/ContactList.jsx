'use client';
import { useSelector } from 'react-redux';
import { Avatar } from '@mui/material';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import dateFormat, { masks } from 'dateformat';
import { useDispatch } from 'react-redux';
import { currentUser } from '@/reduxReducers/Reducers';
import { BsCameraFill } from 'react-icons/bs';

import ContactListVoiceMessage from './ContactListVoiceMessage';
import { useEffect, useState } from 'react';

const ContactList = ({ items, i }) => {
  const { currentChat, ReducerSesiion, ChatMessages } = useSelector(
    (state) => state.User
  );

  const [unReadCount, setunReadCount] = useState(0);
  const [LastMessage, setLastMessage] = useState(null);
  const [user, setuser] = useState(undefined);
  const [CurrentUserLastMessage, setCurrentUserLastMessage] = useState(false);
  // const lastMess = ChatMessages[ChatMessages.length - 1];
  console.log({ LastMessage, items });
  console.log({ CurrentUserLastMessage });

  console.log({ user });
  const dispatch = useDispatch();

  useEffect(() => {
    if (items) {
      const use =
        ReducerSesiion?._id === items.senderId?._id
          ? items.receiverId
          : items.senderId;

      setuser(use);
    }
  }, [items]);

  useEffect(() => {
    const AA =
      user?._id === LastMessage?.senderId ||
      user?._id === LastMessage?.receiverId;
    setCurrentUserLastMessage(AA);
    console.log({ AA });
  }, [user]);

  useEffect(() => {
    const las = ChatMessages[ChatMessages.length - 1];
    setLastMessage(las);
  }, [ChatMessages]);
  function isInCurrentWeek(date) {
    // Ai Generated Code
    // Get the current date
    let currentDate = new Date();

    // Set the start and end date of the current week
    let startOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() - currentDate.getDay()
    );
    let endOfWeek = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + (6 - currentDate.getDay())
    );

    return date >= startOfWeek && date <= endOfWeek;
  }

  const fetchCount = async () => {
    const res = await fetch(
      `/api/contactmessage/${items.receiverId?._id}/${items.senderId?._id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await res.json();

    const forMe = data.filter(
      (items) => items.receiverId === ReducerSesiion?._id
    );
    if (forMe) {
      const count = forMe.filter((items) => items.messageStatus !== 'read');
      setunReadCount(count.length);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  // if chatmessages
  return (
    <div
      className={`w-full flex p-2 justify-between hover:bg-slate-100/50 cursor-pointer  ${
        currentChat?._id === user?._id && ' bg-slate-100/50 text-black'
      }`}
      onClick={() => {
        dispatch(currentUser(user));
        setunReadCount(0);
      }}
    >
      <div className="flex gap-3 items-center w-[70%] ">
        <Avatar
          src={user?.avatar}
          sx={{ width: '60px', height: '60px' }}
          className="w-[60px] h-[60px]"
        />
        <div>
          <h1>{user?.displayName}</h1>
          <div className="flex gap-2 items-center ">
            {LastMessage ? (
              <>
                {' '}
                {LastMessage?.senderId === ReducerSesiion?._id && (
                  <div>
                    {' '}
                    {LastMessage?.messageStatus === 'sent' && <BsCheck2 />}
                    {LastMessage?.messageStatus === 'delivered' && (
                      <BsCheck2All />
                    )}
                    {LastMessage?.messageStatus === 'read' && (
                      <BsCheck2All className="text-[#56e8b5]" />
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                {items?.senderId?._id === ReducerSesiion?._id && (
                  <div>
                    {' '}
                    {items?.messageStatus === 'sent' && <BsCheck2 />}
                    {items?.messageStatus === 'delivered' && <BsCheck2All />}
                    {items?.messageStatus === 'read' && (
                      <BsCheck2All className="text-[#56e8b5]" />
                    )}
                  </div>
                )}
              </>
            )}
            {!CurrentUserLastMessage ? (
              <>
                {' '}
                {items.messageType === 'text' && (
                  <h1 className="text-[14px]">{items.message}</h1>
                )}
                {items.messageType === 'audio' && (
                  <ContactListVoiceMessage items={items} />
                )}
                {items.messageType === 'image' && (
                  <div className="flex gap-2">
                    <BsCameraFill /> Photo
                  </div>
                )}
              </>
            ) : (
              <>
                {' '}
                {LastMessage?.messageType === 'text' && (
                  <h1 className="text-[14px]">{LastMessage?.message}</h1>
                )}
                {LastMessage?.messageType === 'audio' && (
                  <ContactListVoiceMessage items={LastMessage} />
                )}
                {LastMessage?.messageType === 'image' && (
                  <div className="flex gap-2">
                    <BsCameraFill /> Photo
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="w-[30%] flex flex-col justify-around items-center text-[12px]">
        {isInCurrentWeek(new Date(items.createdAt))
          ? dateFormat(items.createdAt, 'dddd')
          : dateFormat(items.createdAt, 'mm/d/yyyy')}
        {unReadCount > 0 && user?._id !== currentChat?._id && (
          <div className="bg-[#18a13c] flex items-center justify-center text-white rounded-full w-[20px] h-[20px] border-none">
            <h1 className="m-auto">{unReadCount}</h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
