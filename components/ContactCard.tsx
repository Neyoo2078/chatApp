'use client';
import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import { useDispatch } from 'react-redux';
import { AddtoChatList, ActiveChat } from '@/Redux/Slices/Users';
import { calculateTime } from '@/utils/CalculateTime';
import { useState } from 'react';

const ContactCard = ({ items, search, messages }: any) => {
  const dispatch = useAppDispatch();

  const { activeChat, onlineUser, currentUser } = useAppSelector(
    (state) => state.Users
  );

  const HandleAddContact = () => {
    if (search) {
      dispatch(AddtoChatList({ _id: items._id, info: items, messages: [] }));
    } else {
      dispatch(ActiveChat(items));
    }
  };
  console.log({ messages });

  const messag = messages?.filter(
    (items: any) => items.messageStatus === 'delivered'
  );
  return (
    <div className="p-2 cursor-pointer" onClick={HandleAddContact}>
      <div className="w-full flex items-start gap-3 ">
        <Image src={items.avatar} alt="profile photo" width={50} height={50} />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <h1 className="font-[500]">{items.displayName}</h1>{' '}
            {!search && (
              <h1 className="text-[10px] font-semibold">
                {messages.length > 0 && (
                  <>{calculateTime(messages[0]?.createdAt)}</>
                )}
              </h1>
            )}
          </div>
          {search ? (
            <div className="text-[14px]">{items.about}</div>
          ) : (
            <div className="text-[12px]">
              {messages.length > 0 ? (
                <div className="w-full flex justify-between">
                  {messages[0]?.message}{' '}
                  {items?._id !== activeChat?._id && messag?.length > 0 && (
                    <div className="bg-[#25D366] rounded-full w-[20px] h-[20px] text-[#fff] flex items-center justify-center">
                      {messag.length}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[14px]">{items.about}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
