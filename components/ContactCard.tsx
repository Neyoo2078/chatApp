import React from 'react';
import Image from 'next/image';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import { useDispatch } from 'react-redux';
import { AddtoChatList, ActiveChat } from '@/Redux/Slices/Users';

const ContactCard = ({ items, search }: any) => {
  const dispatch = useAppDispatch();
  const HandleAddContact = () => {
    if (search) {
      console.log('clicked');
      dispatch(AddtoChatList(items));
    } else {
      dispatch(ActiveChat(items));
    }
  };
  return (
    <div className="p-2 cursor-pointer" onClick={HandleAddContact}>
      <div className="w-full flex items-start gap-3 ">
        <Image src={items.avatar} alt="profile photo" width={50} height={50} />
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between">
            <h1 className="font-[500]">{items.displayName}</h1>{' '}
            {!search && <h1>time</h1>}
          </div>
          {search ? (
            <div className="text-[14px]">{items.about}</div>
          ) : (
            <div>last Message</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactCard;
