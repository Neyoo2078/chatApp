'use client';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { HandleEmojiModal } from '@/reduxReducers/Reducers';
import { useDispatch } from 'react-redux';

const EmojiPickers = ({ message, setmessage, emojiBox }) => {
  const { handleEmojiModal } = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const emojiBox2 = useRef();
  const handleEmojiHandler = (e) => {
    setmessage((prev) => (prev += e.emoji));
  };
  useEffect(() => {
    const handleclickOutside = (e) => {
      if (e.target.id !== 'outside') {
        if (
          emojiBox.current &&
          !emojiBox.current.contains(e.target) &&
          emojiBox2.current &&
          !emojiBox2.current.contains(e.target)
        ) {
          dispatch(HandleEmojiModal(false));
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
      className={`bg-[#e9e6e6] ${
        handleEmojiModal ? 'flex' : 'hidden'
      } text-black h-[50%] w-full p-1 `}
      ref={emojiBox2}
    >
      <EmojiPicker
        width="100%"
        height="100%"
        onEmojiClick={handleEmojiHandler}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiPickers;
