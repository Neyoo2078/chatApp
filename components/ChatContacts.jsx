'use client';

import Avatar from '@mui/material/Avatar';
import {
  BsFillChatLeftTextFill,
  BsThreeDotsVertical,
  BsFilter,
} from 'react-icons/bs';
import { IoIosPeople } from 'react-icons/io';
import { TbCircleDashed } from 'react-icons/tb';
import { HiSearch } from 'react-icons/hi';
import ContactList from './ContactList';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import SearchUserContacts from './SearchUserContacts';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';

import { useRouter } from 'next/navigation';

const ChatContacts = ({ setIsChatListPage, user: users }) => {
  const [UserContacts, setUserContacts] = useState([]);
  const { ReducerSesiion, ChatMessages, Socketinfo } = useSelector(
    (state) => state.User
  );
  const [ContactSearch, setContactSearch] = useState('');
  const [SearchContact, setSearchContact] = useState('');
  const [ContactLoading, setContactLoading] = useState(true);

  const [showlogOut, setshowlogOut] = useState(false);
  const [ContextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const { data } = useSession();
  // useEffect(()=>{
  // if(ChatMessages){
  //   const lastMessage = ChatMessages[ChatMessages.length - 1];
  //   const updateContact = UserContacts
  // }
  // },[ChatMessages])

  // chatmessages = {receiverId: '6491a966731065a3825a9ef7', senderId: '648f1d4294ee6938015043c8', message: 'hi', messageStatus: 'sent', messageType: 'text'}
  // UserContacts= createdAt
  // :
  // "2023-07-24T14:04:01.222Z"
  // message
  // :
  // "hi"
  // messageStatus
  // :
  // "sent"
  // messageType
  // :
  // "text"
  // receiverId
  // :
  // {_id: '6491a966731065a3825a9ef7', name: 'Adeola Adekemi', email: 'adeolaadekee@gmail.com', newUser: false, availability: false, …}
  // senderId
  // :
  // {_id: '648f1d4294ee6938015043c8', name: 'Adeniyi Olatunji', email: 'neyoo2078@gmail.com', newUser: false, availability: false, …}
  // __v
  // :
  // 0
  // _id
  // :
  // "64be84d1d6bf09898f25633e"
  const navigate = useRouter();
  const fetchMessageContact = async () => {
    setContactLoading(true);
    try {
      const res = await fetch(`/api/contacts/${data?.user?.id}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      const datas = await res.json();

      let Filts = [];
      let currentId;
      datas?.forEach((elements) => {
        const userss =
          elements.senderId._id !== data?.user?.id ||
          elements.receiverId._id !== data?.user?.id;
        if (userss) {
          const { _id: sender } = elements.senderId;
          const { _id: recieve } = elements.receiverId;
          currentId = sender === data?.user?.id ? recieve : sender;

          const exist = Filts.find((items) => {
            return (
              items.receiverId?._id === currentId ||
              items.senderId?._id === currentId
            );
          });

          if (!exist) {
            Filts.push(elements);
          } else {
            Filts = Filts.map((items) =>
              items.senderId?._id === currentId ||
              items.recieverId?._id === currentId
                ? elements
                : items
            );
          }
        }
      });

      setUserContacts(Filts);
      setContactLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const FilterContact = () => {
    const newContact = UserContacts.filter(
      (items) =>
        items.receiverId.displayName
          .toLowerCase()
          .includes(ContactSearch.toLowerCase()) ||
        items.senderId.displayName
          .toLowerCase()
          .includes(ContactSearch.toLowerCase())
    );
    setSearchContact(newContact);
  };

  useEffect(() => {
    FilterContact();
  }, [ContactSearch]);
  useEffect(() => {
    if (data?.user) {
      fetchMessageContact();
    }
  }, []);
  return (
    <div className="w-full text-white gap-3  flex flex-col p-1 ">
      {showlogOut && (
        <div
          className={`fixed bg-slate-200 p-1 text-black/50 cursor-pointer`}
          style={{ top: ContextPosition.y + 15, left: ContextPosition.x - 50 }}
          onClick={() => {
            Socketinfo?.emit('Sign_out', data?.user?.id);
            signOut({ redirect: false });
            navigate.push('/');
          }}
        >
          Log out
        </div>
      )}
      <h1 className="font-bold text-[30px]">Chats</h1>

      <div className="flex justify-between px-2">
        <div>
          <Avatar
            src={users?.avatar}
            alt="profile"
            className="w-[60px] h-[60px]"
            sx={{ width: '60px', height: '60px' }}
          />
        </div>
        <div className="flex gap-2 w-[50%] items-center  justify-between">
          <IoIosPeople className="w-[30px] h-[30px]" />
          <TbCircleDashed className="w-[30px] h-[30px]" />
          <BsFillChatLeftTextFill
            onClick={() => {
              setIsChatListPage(false);
            }}
            className="w-[30px] h-[30px] cursor-pointer"
          />
          <BsThreeDotsVertical
            className="w-[30px] h-[30px] cursor-pointer"
            onClick={(e) => {
              setshowlogOut(!showlogOut);
              setContextPosition({ x: e.pageX, y: e.pageY });
            }}
          />
        </div>
      </div>
      <div className="px-3 flex justify-between items-center">
        <div className="bg-gray-500 flex gap-3 items-center w-[80%] p-1 justify-between rounded-sm">
          <HiSearch className="w-[25px] h-[25px] text-white" />
          <input
            value={ContactSearch}
            placeholder="Search or start new chat"
            className="outline-none focus:outline-none w-[80%] bg-transparent"
            onChange={(e) => setContactSearch(e.target.value)}
          />
        </div>
        <BsFilter className="w-[30px] h-[30px]" />
      </div>
      {ContactSearch <= 1 ? (
        <div className="flex flex-col gap-1">
          {ContactLoading ? (
            <> Loading</>
          ) : (
            <div>
              {' '}
              {UserContacts?.map((items, i) => (
                <ContactList items={items} key={i} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <SearchUserContacts SearchContact={SearchContact} />
      )}
    </div>
  );
};

export default ChatContacts;
