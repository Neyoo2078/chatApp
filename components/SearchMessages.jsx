'use client';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bi';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { SearchMessages } from '@/reduxReducers/Reducers';

const Bar = ({ Searchmessage, setSearchmessage }) => {
  const dispatch = useDispatch();

  return (
    <div className="w-full  flex flex-col p-3 bg-slate-200  ">
      <div className="flex  items-center gap-6 w-full p-1 m-2">
        <AiOutlineClose
          className="w-[25px] h-[25px] text-black/50 font-bold cursor-pointer"
          title="close"
          onClick={() => {
            dispatch(SearchMessages(false));
          }}
        />
        <h1 className="text-black text-[15px]">Search Messages</h1>
      </div>
      <div className="flex gap-3  items-center w-full">
        <div className="bg-white flex gap-3  items-center p-2 w-[50%] rounded-md">
          <BiSearch className="w-[25px] h-[25px]" />
          <input
            className=" outline-none border-none w-full text-black"
            placeholder="Search messages..."
            value={Searchmessage}
            onChange={(e) => {
              setSearchmessage(e.target.value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Bar;
