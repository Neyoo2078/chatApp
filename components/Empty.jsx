import React from 'react';
import Image from 'next/image';

const Empty = () => {
  return (
    <div className="w-full  h-full flex bg-[#181616] items-center justify-center text-white border-[1px]">
      <Image src="/whatsapp.gif" width={250} height={250} />
    </div>
  );
};

export default Empty;
