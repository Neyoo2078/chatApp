import React from 'react';
import Image from 'next/image';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';
import dateFormat, { masks } from 'dateformat';

const ImageMessages = ({ items, i }) => {
  // date
  masks.hammerTime = 'HH:MM';
  console.log({ items });
  // 17:46! Can't touch this!
  return (
    <div key={i} className="bg-[#a8f29a] relative  ">
      <Image
        src={`${process.env.BaseUrl}/${items.message}`}
        width={300}
        height={300}
        className="rounded-lg"
        alt="asset"
      />
      <div className="absolute bottom-4 right-4 flex gap-2 items-center">
        <h1 className="text-[10px]">
          {dateFormat(items.createdAt, 'hammerTime')}
        </h1>
        {items.messageStatus === 'sent' && <BsCheck2 />}
        {items.messageStatus === 'delivered' && <BsCheck2All />}
        {items.messageStatus === 'read' && (
          <BsCheck2All className="text-[#56e8b5]" />
        )}
      </div>
    </div>
  );
};

export default ImageMessages;
