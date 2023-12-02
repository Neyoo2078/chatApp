'use client';
import React, { useEffect, useState } from 'react';
import ButtomBar from './ButtomBar';
import { useSession, signIn, signOut } from 'next-auth/react';
import { getAllUsers } from '@/lib/Actions/UserActions';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';
import ContactCard from './ContactCard';
import { LuSearch } from 'react-icons/lu';
import { AddtoChatList, Chatlist } from '@/Redux/Slices/Users';
import { IoMdArrowBack } from 'react-icons/io';
import { io } from 'socket.io-client';
import { GetUserByEmail } from '@/lib/Actions/UserActions';
import { CurrentUserDetails, OnlineUsers } from '@/Redux/Slices/Users';
import { SocketReducer } from '@/Redux/Slices/Messages';
import { useSocket } from '@/providers/socket-provider';
import { calculateTime } from '@/utils/CalculateTime';

const SideBarClient = ({ GetCUser, Auser, Contacts }: any) => {
  const { data: session } = useSession();

  // use States
  const [AllUser, setAllUser] = useState(Auser);
  const [filterUser, setfilterUser] = useState([]);
  const [searchFocus, setsearchFocus] = useState(false);

  // use Selector
  const { activeChat, userChatList, currentUser, onlineUser } = useAppSelector(
    (state) => state.Users
  );

  const { activeMessages, sockett: socket } = useAppSelector(
    (state) => state.Messages
  );

  // initiaolize dispatch
  const dispatch = useAppDispatch();

  // const { isConnected, socket } = useSocket();
  // console.log({ isConnected, socket });
  // // Socket Io
  // var socket: any;

  useEffect(() => {
    dispatch(CurrentUserDetails(GetCUser));
  }, [GetCUser]);
  const AA = process.env.SERVER_URL;

  useEffect(() => {
    if (currentUser) {
      const sockett = io('http://localhost:5000');
      dispatch(SocketReducer(sockett));
    }
  }, [currentUser]);

  // const handleJoin = () => {
  //   if (session) {
  //     console.log('entered join room');
  //     socket?.emit('join_room', currentUser?._id);
  //   }
  // };
  const handleJoin = () => {
    if (socket) {
      socket?.emit('join_room', currentUser?._id);
    }
  };

  useEffect(() => {
    if (currentUser && socket) {
      socket?.on('online_users', (data: any) => {
        dispatch(OnlineUsers(data));
      });
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (currentUser && socket) {
      handleJoin();
    }
  }, [currentUser, socket]);
  // Socket Io Ends

  // useEffect(() => {
  //   const filterAllUsers = AllUser.filter((items: any) => {
  //     const exist = userChatList.find((item: any) => item._id === items._id);
  //     if (!exist) {
  //       return items;
  //     }
  //   });

  //   setfilterUser(filterAllUsers)
  // }, [AllUser, userChatList]);
  // useEffect to filter contacts

  useEffect(() => {
    const filterContact = AllUser?.filter((items: any) => {
      const exist = userChatList?.find((item: any) => item._id === items._id);
      if (!exist) {
        return items;
      }
    });
    setfilterUser(filterContact);
  }, [userChatList]);

  useEffect(() => {
    dispatch(Chatlist(Contacts));
  }, [Contacts]);
  // useEffect(() => {
  //   if (session) {
  //     Auser();
  //   }
  // }, [session]);
  return (
    <div className="w-full h-full ">
      <div className="h-[10%] p-3 flex w-full justify-between items-center">
        <h1 className="text-[25px] font-semibold">Chats</h1>
        {session ? (
          <button
            onClick={() => {
              signOut({ redirect: false });
              socket.emit('Sign_out', currentUser?._id);
            }}
            className="text-[#c43d3d]"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => {
              signIn();
            }}
            className="text-[#c43d3d]"
          >
            Sign in
          </button>
        )}
      </div>
      <div className="h-[10%] items-center p-2 flex gap-3">
        {searchFocus && (
          <IoMdArrowBack
            onClick={() => {
              setsearchFocus(false);
            }}
            className="w-[30px] h-[30px]"
          />
        )}
        <div className="w-[80%] rounded-full items-center p-2 gap-2 bg-white flex ">
          <LuSearch />
          <input
            onFocus={() => {
              setsearchFocus(true);
            }}
            type="text"
            placeholder="search contact"
            className="outline-none w-[90%] "
          />
        </div>
      </div>
      {searchFocus && (
        <div className="flex flex-col gap-1 h-[80%] p-2  ">
          {filterUser?.map((items, i) => (
            <ContactCard key={i} items={items} search />
          ))}
        </div>
      )}
      {!searchFocus && (
        <div className="flex flex-col gap-1 h-[80%] p-2  ">
          {userChatList?.map((items: any, i: number) => (
            <ContactCard key={i} items={items.info} messages={items.messages} />
          ))}
        </div>
      )}

      <ButtomBar />
    </div>
  );
};

export default SideBarClient;
