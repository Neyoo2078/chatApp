'uise client';
import { useEffect, useRef } from 'react';
import dateFormat, { masks } from 'dateformat';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';

const Highlite = ({
  items,
  i,
  Searchmessage,
  isInCurrentWeek,
  ReducerSesiion,
}) => {
  const messageRef = useRef();
  function highlightSearchTerm(searchTerm, result) {
    if (messageRef.current) {
      if (searchTerm !== '') {
        var regex = new RegExp(searchTerm);

        messageRef.current.innerHTML = result.replace(
          regex,
          `<span id="highlight">${regex.toString().slice(1, -1)}</span>`
        );
      }
    }
  }

  useEffect(() => {
    highlightSearchTerm(Searchmessage, items.message);
  }, [Searchmessage]);
  return (
    <div className="w-full border-b-[2px] p-3 border-gray-400 cursor-pointer hover:bg-slate-300">
      <h1 className="text-gray-500">
        {isInCurrentWeek(items.createdAt)
          ? dateFormat(items.createdAt)
          : dateFormat(items.createdAt, 'mm/d/yyyy')}
      </h1>
      <div className="text-[15px] flex gap-2 items-center ">
        {items.senderId === ReducerSesiion?._id && (
          <div>
            {items.messageStatus === 'sent' && <BsCheck2 />}
            {items.messageStatus === 'delivered' && <BsCheck2All />}
            {items.messageStatus === 'read' && (
              <BsCheck2All className="text-[#56e8b5]" />
            )}
          </div>
        )}
        <h1 id="result" ref={messageRef}></h1>
      </div>
    </div>
  );
};

export default Highlite;
