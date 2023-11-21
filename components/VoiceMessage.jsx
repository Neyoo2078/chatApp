'use client';
import { useEffect, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useRef } from 'react';
import { FaPlay, FaStop, FaMicrophone, FaRegPauseCircle } from 'react-icons/fa';
import { Avatar } from '@mui/material';
import { useSession } from 'next-auth/react';
import dateFormat, { masks } from 'dateformat';
import { BsCheck2, BsCheck2All } from 'react-icons/bs';

const sendAudioMessage = ({ items, user }) => {
  const [WaveForm, setWaveForm] = useState(null);
  const [AudioMessage, setAudioMessage] = useState(null);
  const [isPlaying, setisPlaying] = useState(false);
  const [TotalDuration, setTotalDuration] = useState(0);
  const [CurrentPlayBackTime, setCurrentPlayBackTime] = useState(0);

  const { data: session } = useSession();

  const waveform = useRef();
  const waveBox = useRef();
  console.log({ a: waveform.current });

  const IconStyle = 'w-[25px] h-[25px] cursor-pointer';

  console.log({ items });
  console.log({ isPlaying });
  console.log({ AudioMessage });
  console.log({ TotalDuration });
  console.log({ date: dateFormat(items.createdAt, 'hammerTime') });
  const handlePauseAudio = () => {
    waveform.current.stop();
    AudioMessage.pause();
    setisPlaying(false);
  };

  const handlePlayAudio = () => {
    console.log({ isPlaying });
    if (AudioMessage) {
      console.log('we entered');
      waveform.current.stop();
      waveform.current.play();
      AudioMessage.play();
      setisPlaying(true);
    }
  };

  useEffect(() => {
    if (AudioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(AudioMessage.currentTime);
      };
      AudioMessage.addEventListener('timeupdate', updatePlaybackTime);

      return () => {
        AudioMessage.removeEventListener('timeupdate', updatePlaybackTime);
      };
    }
  }, [AudioMessage]);

  useEffect(() => {
    if (waveform.current) {
      console.log('we entered');
      const audioUrl = `${process.env.BaseUrl}/${items?.message}`;
      const audio = new Audio(audioUrl);

      setAudioMessage(audio);

      waveform?.current?.load(audioUrl);
      waveform.current.on('ready', () => {
        setTotalDuration(waveform.current.getDuration());
      });
    }
  }, [waveform.current]);

  useEffect(() => {
    if (WaveForm === null) {
      console.log('we creating');
      waveform.current = WaveSurfer.create({
        container: 'waveBox',
        waveColor: '#ccc',
        progressColor: '#4a9eff',
        cursorColor: '#7ae3c3',
        barWidth: 2,
        height: 30,
        responsive: true,
      });
      waveform.current.on('finish', () => {
        setisPlaying(false);
      });

      return () => {
        waveform.current.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (AudioMessage) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(AudioMessage.currentTime);
      };
      AudioMessage.addEventListener('timeupdate', updatePlaybackTime);

      return () => {
        AudioMessage.removeEventListener('timeupdate', updatePlaybackTime);
      };
    }
  }, [AudioMessage]);

  const formatTime = (time) => {
    if (isNaN(time)) return '00.00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')} : ${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // date
  masks.hammerTime = 'HH:MM';

  // 17:46! Can't touch this!

  return (
    <div className="p-1 bg-gray-400 flex gap-2 relative  items-center justify-between">
      <div>
        <Avatar
          src={user?.avatar}
          alt="profile"
          className="w-[60px] h-[60px]"
          sx={{ width: '60px', height: '60px' }}
        />
      </div>
      <div className="absolute  flex gap-1 bottom-1 right-2 text-[15px] text-black">
        {' '}
        <h1 className="text-[10px]">
          {dateFormat(items.createdAt, 'hammerTime')}
        </h1>
        {items?.senderId === user?._id && (
          <div>
            {items.messageStatus === 'sent' && <BsCheck2 />}
            {items.messageStatus === 'delivered' && <BsCheck2All />}
            {items.messageStatus === 'read' && (
              <BsCheck2All className="text-[#56e8b5]" />
            )}
          </div>
        )}
      </div>
      <>
        {!isPlaying ? (
          <FaPlay onClick={handlePlayAudio} className={IconStyle} />
        ) : (
          <FaStop onClick={handlePauseAudio} className={IconStyle} />
        )}
      </>
      <div className="w-60" id="waveBox" />

      <div>
        {AudioMessage && isPlaying && (
          <span>{formatTime(CurrentPlayBackTime)}</span>
        )}
        {AudioMessage && !isPlaying && <span>{formatTime(TotalDuration)}</span>}
      </div>
    </div>
  );
};

export default sendAudioMessage;
