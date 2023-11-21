'use client';
import { AiOutlineClose } from 'react-icons/ai';
import { BiSearch } from 'react-icons/bs';
import SearchBar from './SearchMessages';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import dateFormat, { masks } from 'dateformat';
import '../app/globals.css';
import Highlite from './Highlite';

const SearchContainer = () => {
  const [Searchmessage, setSearchmessage] = useState('');
  const [SearchArray, setSearchArray] = useState([]);
  const { currentChat, currentUser, ChatMessages, ReducerSesiion } =
    useSelector((state) => state.User);

  useEffect(() => {
    if (Searchmessage) {
      const filterMessages = ChatMessages.filter((items) =>
        items.message.includes(Searchmessage)
      );
      setSearchArray(filterMessages);
    }
  }, [Searchmessage]);

  // Create a function to check if a date falls within the current week
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

  // Test the function with a sample date
  let sampleDate = new Date(); // Replace with your desired date
  let isWithinCurrentWeek = isInCurrentWeek(sampleDate);

  // Output the result
  if (isWithinCurrentWeek) {
    console.log('The date falls within the current week.');
  } else {
    console.log('The date does not fall within the current week.');
  }

  return (
    <div className="bg-chat-bg h-screen flex flex-col w-full">
      <SearchBar
        Searchmessage={Searchmessage}
        setSearchmessage={setSearchmessage}
      />
      {Searchmessage.length === 0 ? (
        <h1 className="mx-auto my-9 text-[15px]">
          search messages with {currentChat.displayName}
        </h1>
      ) : Searchmessage.length && !SearchArray.length ? (
        <>no message found</>
      ) : (
        <div className=" w-full flex flex-col text-[12px] ">
          {SearchArray.map((items, i) => (
            <Highlite
              items={items}
              i={i}
              Searchmessage={Searchmessage}
              isInCurrentWeek={isInCurrentWeek}
              ReducerSesiion={ReducerSesiion}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchContainer;
