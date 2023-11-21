'use client';
import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { AiFillAudio } from 'react-icons/ai';

const contactListVoiceMessage = ({ items }) => {
  const [WaveForm, setWaveForm] = useState(null);
  const [TotalDuration, setTotalDuration] = useState('');
  const [waveTest, setwaveTest] = useState(null);

  const waveform = useRef();
  const waveBox = useRef();

  useEffect(() => {
    if (waveform.current) {
      console.log('we entered');
      const audioUrl = `${process.env.BaseUrl}/${items?.message}`;
      const audio = new Audio(audioUrl);

      waveform?.current?.load(audioUrl);
      waveform.current.on('ready', () => {
        setTotalDuration(waveform.current.getDuration());
      });
    }
  }, [waveform.current, WaveForm]);

  useEffect(() => {
    if (WaveForm === null) {
      waveform.current = WaveSurfer.create({
        container: waveBox.current,
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
      setWaveForm(true);

      return () => {
        waveform.current.destroy();
      };
    }
  }, []);

  const formatTime = (time) => {
    if (isNaN(time)) return '00.00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')} : ${seconds
      .toString()
      .padStart(2, '0')}`;
  };
  return (
    <div className="flex items-center gap-2">
      {' '}
      <div ref={waveBox} hidden />
      <AiFillAudio />
      <h1 className="text-[14px]">{formatTime(TotalDuration)}</h1>
    </div>
  );
};

export default contactListVoiceMessage;
