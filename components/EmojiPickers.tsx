import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect, useRef } from 'react';

const EmojiPickers = ({ openEmoji, setopenEmoji, setaddComment }: any) => {
  const emojiBox2: React.RefObject<HTMLDivElement> | null = useRef(null);

  useEffect(() => {
    const handleclickOutside = (e: any) => {
      if (e.target.id !== 'outside') {
        if (emojiBox2.current) {
          if (emojiBox2.current && !emojiBox2?.current?.contains(e.target)) {
            setopenEmoji(false);
          }
        }
      }
    };
    document.addEventListener('click', handleclickOutside);
    return () => {
      document.removeEventListener('click', handleclickOutside);
    };
  }, []);
  return (
    <div
      id="outside"
      ref={emojiBox2}
      className="w-[400px] h-[400px] fixed left-[95px] bottom-[50px]"
    >
      <EmojiPicker
        width="400"
        height="100%"
        onEmojiClick={(e) => {
          setaddComment((prev: any) => {
            return (prev += e.emoji);
          });
        }}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiPickers;
