'use client';
import React, { useEffect, useState, useRef } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);
  console.log({ isScrolled });
  const scrollDiv = useRef<HTMLDivElement>(null);
  console.log({ scrollDiv });

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

  useEffect(() => {
    if (currentUser) {
      const sockett = io(process.env.WEB_SERVER || 'http://localhost:5000');
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

  // UseEffct to control the size of sideBar
  useEffect(() => {
    const handleScreenWidth = () => {
      const sidebar = document.getElementById('sidebar');
      console.log({ activeChat, sidebar, w: window.innerWidth });
      if (activeChat && sidebar && window.innerWidth < 400) {
        sidebar.style.display = 'none';
      } else if (activeChat && sidebar && window.innerWidth > 400) {
        // If the screen width is 400px or more, set display to "block" (or any other value you prefer)
        sidebar.style.display = 'block';
      } else if (!activeChat && sidebar && window.innerWidth < 400) {
        // If the screen width is 400px or more, set display to "block" (or any other value you prefer)
        sidebar.style.display = 'block';
      }
    };
    // Listen for window resize events and update display property accordingly
    window.addEventListener('resize', handleScreenWidth);
  }, [activeChat]);

  // UseEffct to control the size of sideBar
  useEffect(() => {
    const handleScreenWidth = () => {
      const sidebar = document.getElementById('sidebar');
      console.log({ activeChat, sidebar, w: window.innerWidth });
      if (activeChat && sidebar && window.innerWidth < 400) {
        sidebar.style.display = 'none';
      } else if (activeChat && sidebar && window.innerWidth > 400) {
        // If the screen width is 400px or more, set display to "block" (or any other value you prefer)
        sidebar.style.display = 'block';
      } else if (!activeChat && sidebar && window.innerWidth < 400) {
        // If the screen width is 400px or more, set display to "block" (or any other value you prefer)
        sidebar.style.display = 'block';
      }
    };
    handleScreenWidth();
  }, [activeChat]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollDiv.current) {
        const div = scrollDiv.current;
        const scrollHeight = div?.scrollTop;
        // Set your desired threshold height

        const thresholdHeight = 50;

        // Update the state based on whether the scroll height has passed the threshold
        if (scrollHeight && scrollHeight > thresholdHeight) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      }
    };
    const div = scrollDiv.current;
    // Add scroll event listener when the component mounts
    div?.addEventListener('scroll', handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      div?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollDiv.current]); // Empty dependency array means the effect runs once when the component mounts

  return (
    <div className={` w-full h-full  overflow-y-auto `} ref={scrollDiv}>
      <div
        className={`${
          isScrolled ? 'sticky top-0 bg-black/95' : 'bg-transparent'
        } `}
      >
        <div className={`h-[10%] p-3 flex w-full justify-between items-center`}>
          <h1
            className={`text-[25px] font-semibold ${
              isScrolled ? ' text-white' : 'text-black'
            } `}
          >
            Chats
          </h1>
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
              className={`w-[30px] h-[30px] ${
                isScrolled ? ' text-white' : 'text-black'
              } `}
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
      </div>
      {searchFocus && (
        <div className="flex flex-col gap-1 h-[80%] p-2  ">
          <h1>Contacts</h1>
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
