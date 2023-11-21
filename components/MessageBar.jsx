'use client';
import { CgSmileMouthOpen } from 'react-icons/cg';
import { MdAttachment, MdSend } from 'react-icons/md';
import { AiFillAudio, AiOutlineClose, AiOutlineGif } from 'react-icons/ai';
import { HiOutlineGif } from 'react-icons/hi';
import { BsFileEarmark } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UpdateChatMessage } from '@/reduxReducers/Reducers';
import { HandleEmojiModal } from '@/reduxReducers/Reducers';
import PhotoPicker from './PhotoPicker';
import axios from 'axios';
import FormData from 'form-data';
import AudioMessage from './AudioMessage';

const MessageBar = ({ message, setmessage, emojiBox }) => {
  const { data: session, status } = useSession();
  const { currentChat, Socketinfo, handleEmojiModal } = useSelector(
    (state) => state.User
  );
  const [ChatPicker, setChatPicker] = useState(false);
  const [AttachFile, setAttachFile] = useState(null);
  const [audioMessage, setaudioMessage] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    setmessage('');
  }, [currentChat]);

  const photoPickChange = async (e) => {
    const file = e.target.files[0];

    const formdata = new FormData();
    formdata.append('image', file);

    try {
      const res = await axios.post(
        `${process.env.BaseUrl}/image/add-image-message/?from=${session?.user.id}&to=${currentChat._id}`,
        formdata,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log({ res });
      if (res.status === '200') {
        await Socketinfo.emit('send-msg', {
          to: currentChat._id,
          from: session?.user.id,
          message: res.data?.message,
          messageType: 'image',
          messageStatus: 'read',
        });
      }
      dispatch(
        UpdateChatMessage({
          receiverId: currentChat._id,
          senderId: session?.user.id,
          message: res.data?.message,
          messageType: 'image',
          messageStatus: 'sent',
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (ChatPicker) {
      const data = document.getElementById('photo-picker');
      data.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setChatPicker(false);
        }, 1000);
      };
    }
  }, [ChatPicker]);
  const messageHandler = async (e) => {
    dispatch(HandleEmojiModal(false));

    if (message.length === 0) {
      return;
    }
    try {
      const res = await fetch(
        `/api/message/${currentChat._id}/${session?.user.id}`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: session?.user.id,
            receiverId: currentChat._id,
            message,
          }),
        }
      );
      const data = await res.json();

      await Socketinfo.emit('send-msg', {
        to: currentChat._id,
        from: session?.user.id,
        message: data?.message,
        messageStatus: 'read',
        messageType: 'text',
      });

      dispatch(
        UpdateChatMessage({
          receiverId: currentChat._id,
          senderId: session?.user.id,
          message: data?.message,
          messageStatus: 'sent',
          messageType: 'text',
        })
      );
      setmessage('');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      id="outside"
      className="full flex  justify-between items-center text-gray-500 h-[10%] p-1 bg-slate-300"
    >
      <div
        ref={emojiBox}
        className=" flex justify-between w-full p-1 items-center"
      >
        {!audioMessage && (
          <div className="flex items-center w-full justify-between">
            {handleEmojiModal && (
              <AiOutlineClose
                onClick={() => {
                  dispatch(HandleEmojiModal(false));
                }}
                title="Close"
                className="w-[30px] h-[30px] cursor-pointer"
              />
            )}
            <CgSmileMouthOpen
              title="Add smiley"
              className="w-[30px] h-[30px] cursor-pointer"
              onClick={() => {
                dispatch(HandleEmojiModal(true));
              }}
            />
            {handleEmojiModal && (
              <AiOutlineGif
                title="Add smiley"
                className="w-[30px] h-[30px] cursor-pointer"
              />
            )}
            {handleEmojiModal && (
              <BsFileEarmark
                title="Add smiley"
                className="w-[30px] h-[30px] cursor-pointer"
              />
            )}

            <MdAttachment
              onClick={() => {
                setChatPicker(true);
              }}
              title="attach file"
              className="w-[30px] h-[30px] cursor-pointer"
            />
            <input
              placeholder="Type a message"
              className={`outline-none bg-white p-2  rounded-lg ${
                handleEmojiModal && 'w-[70%]'
              } focus:outline-none w-[80%] bg-transparent`}
              onChange={(e) => {
                setmessage(e.target.value);
              }}
              value={message}
            />
            {message.length >= 1 && (
              <MdSend
                onClick={messageHandler}
                title="Send"
                className="w-[30px] h-[30px]"
              />
            )}
            {message.length === 0 && (
              <AiFillAudio
                title="audio message"
                onClick={() => {
                  setaudioMessage(true);
                }}
                className="w-[30px] h-[30px] cursor-pointer"
              />
            )}
          </div>
        )}
        {audioMessage && <AudioMessage hide={setaudioMessage} />}
      </div>

      {ChatPicker && <PhotoPicker change={photoPickChange} />}
    </div>
  );
};

export default MessageBar;
