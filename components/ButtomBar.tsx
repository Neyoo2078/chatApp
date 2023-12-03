import React from 'react';
import { IoCall } from 'react-icons/io5';
import { IoIosPeople } from 'react-icons/io';
import { PiChatsThin } from 'react-icons/pi';
import { IoSettingsOutline } from 'react-icons/io5';

const ButtomBar = () => {
  const iconStyles = ' w-[30px] h-[30px] text-white ';
  return (
    <div className="md:hidden fixed z-40 bottom-0  h-[50px] bg-[#17181af1] opacity-60  w-full">
      <div className=" flex gap-1 justify-evenly w-full h-full items-center">
        <IoIosPeople className={iconStyles} title="community" />{' '}
        <IoCall className={iconStyles} title="calls" />{' '}
        <PiChatsThin className={iconStyles} title="chats" />{' '}
        <IoSettingsOutline className={iconStyles} title="settings" />
      </div>
    </div>
  );
};

export default ButtomBar;
