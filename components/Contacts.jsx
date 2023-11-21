'use client';
import { MdArrowBack } from 'react-icons/md';
import { HiSearch } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Avatar } from '@mui/material';
import { currentUser } from '@/reduxReducers/Reducers';
import { useDispatch } from 'react-redux';
import { useSession } from 'next-auth/react';

//

const Contacts = ({ setIsChatListPage }) => {
  const { data: session } = useSession();

  const [groupUsers, setgroupUsers] = useState({});
  const [SearchTerm, setSearchTerm] = useState('');
  const [SearchUser, setSearchUser] = useState([]);
  const what = Object.entries(groupUsers);

  const dispatch = useDispatch();

  const Alluser = async () => {
    const res = await fetch(`/api/alluser/${session?.user.id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    setgroupUsers(data.groupedUsers);
  };

  useEffect(() => {
    Alluser();
  }, []);

  useEffect(() => {
    const newWhat = what.filter(([_, subArray]) =>
      subArray.some(({ displayName }) =>
        displayName.toLowerCase().includes(SearchTerm.toLowerCase())
      )
    );
    setSearchUser(newWhat);
  }, [SearchTerm]);

  //   here

  // to Start a Chat

  return (
    <div className="w-full flex flex-col gap-2 h-[calc(100vh-18px)] ">
      <div className="bg-gray-500 w-full items-center flex gap-5 p-3">
        <MdArrowBack
          onClick={() => {
            setIsChatListPage(true);
          }}
          className="w-[30px] h-[30px] cursor-pointer"
          title="Back"
        />
        <h1>New Chat</h1>
      </div>
      <div className="bg-gray-500 flex gap-3 items-center w-full p-2 justify-between rounded-sm">
        <HiSearch className="w-[25px] h-[25px] text-white" />
        <input
          placeholder="Search or start new chat"
          className="outline-none focus:outline-none w-[80%] bg-transparent"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          value={SearchTerm}
        />
      </div>
      {SearchTerm <= 1 ? (
        <div className="overflow-auto h-[90%] flex flex-col gap-2 p-2">
          {what.map(([initialLetter, userlist], i) => (
            <div key={i} className="flex gap-3 flex-col">
              <h1>{initialLetter.toUpperCase()}</h1>
              <div className="flex flex-col gap-2">
                {userlist.map((items, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      console.log({ items });
                      dispatch(currentUser(items));
                    }}
                    className="flex item-center hover:bg-slate-600 p-2 cursor-pointer  gap-3"
                  >
                    <Avatar className="my-[1px]" src={items.avatar} />
                    <div className="flex flex-col  justify-start ">
                      <h1 className="text-[15px]">{items.displayName}</h1>
                      <h1 className="text-[10px]">{items.about}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {SearchUser.map(([initialLetter, userlist], i) => (
            <div key={i} className="flex gap-3 flex-col">
              <h1>{initialLetter.toUpperCase()}</h1>
              <div className="flex flex-col gap-2">
                {userlist.map((items, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      dispatch(currentUser(items));
                    }}
                    className="flex item-center hover:bg-slate-600 p-2 cursor-pointer  gap-3"
                  >
                    <Avatar className="my-[1px]" src={items.avatar} />
                    <div className="flex flex-col  justify-start ">
                      <h1 className="text-[15px]">{items.displayName}</h1>
                      <h1 className="text-[10px]">{items.about}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
