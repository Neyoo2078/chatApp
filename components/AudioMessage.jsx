'use client';
import { BsTrash3 } from 'react-icons/bs';
import { MdSend } from 'react-icons/md';
import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaStop, FaMicrophone, FaRegPauseCircle } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { UpdateChatMessage } from '@/reduxReducers/Reducers';

const AudioMessage = ({ hide }) => {
  const [Recording, setRecording] = useState(false);
  const [RecordedAudio, setRecordedAudio] = useState(null);
  const [WaveForm, setWaveForm] = useState(null);
  const [RecordingDuration, setRecordingDuration] = useState(0);
  const [CurrentPlayBackTime, setCurrentPlayBackTime] = useState(0);
  const [TotalDuration, setTotalDuration] = useState(0);
  const [isPlaying, setisPlaying] = useState(false);
  const [RenderedAudio, setRenderedAudio] = useState(null);

  const { data: session } = useSession();

  const { currentChat } = useSelector((state) => state.User);
  // Ref,s
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  //   Dispatch

  const dispatch = useDispatch();

  const IconStyle = 'w-[25px] h-[25px] cursor-pointer';

  //   HANDLERS

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && Recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      WaveForm.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener('stop', () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
        const audioFile = new File([audioBlob], 'recording.mp3');
        setRenderedAudio(audioFile);
      });
    }
  };
  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlayBackTime(0);
    setTotalDuration(0);
    setRecording(true);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/ogg; codecs-opus' });
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          setRecordedAudio(audio);

          WaveForm.load(audioUrl);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.log('error accessing microphone', error);
      });
  };
  const handlePauseRecording = () => {
    WaveForm.stop();
    RecordedAudio.pause();
    setisPlaying(false);
  };
  const handlePlayRecording = () => {
    if (RecordedAudio) {
      WaveForm.stop();
      WaveForm.play();
      RecordedAudio.play();
      setisPlaying(true);
    }
  };
  const sendRecording = async () => {
    const formdata = new FormData();
    formdata.append('audio', RenderedAudio);

    try {
      const res = await axios.post(
        `${process.env.BaseUrl}/audio/add-image-message/?from=${session?.user.id}&to=${currentChat?._id}`,
        formdata,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

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
          messageType: 'audio',
          messageStatus: 'sent',
        })
      );
      hide(false);
    } catch (error) {
      console.log(error);
    }
  };
  //   END OF HANDLERS

  //   AUDIO USE EFFECTS

  useEffect(() => {
    if (RecordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlayBackTime(RecordedAudio.currentTime);
      };
      RecordedAudio.addEventListener('timeupdate', updatePlaybackTime);

      return () => {
        RecordedAudio.removeEventListener('timeupdate', updatePlaybackTime);
      };
    }
  }, [RecordedAudio]);

  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: '#waveBox',
      waveColor: '#ccc',
      progressColor: '#4a9eff',
      cursorColor: '#7ae3c3',
      barWidth: 2,
      height: 30,
      responsive: true,
    });

    setWaveForm(wavesurfer);
    wavesurfer.on('finish', () => {
      setisPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (WaveForm) {
      handleStartRecording();
    }
  }, [WaveForm]);

  useEffect(() => {
    let interval;
    if (Recording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => {
          setTotalDuration(prev + 1);
          return prev + 1;
        });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [Recording]);

  //   FORMAT  TIME
  const formatTime = (time) => {
    if (isNaN(time)) return '00.00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')} : ${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full items-center gap-2 justify-end p-2 ">
      <BsTrash3
        onClick={() => {
          hide(false);
        }}
        title="Delete"
        className={IconStyle}
      />

      <div className="w-70 bg-slate-600 flex justify-end gap-2 rounded-full p-2 items-center ">
        {Recording ? (
          <div className="flex animate-pulse gap-1 text-red-500 text-center">
            <h1>Recording</h1> <span>{RecordingDuration}s</span>
          </div>
        ) : (
          <div className=" flex ">
            {RecordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecording} className={IconStyle} />
                ) : (
                  <FaStop
                    onClick={handlePauseRecording}
                    className={IconStyle}
                  />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60 " id="waveBox" hidden={Recording} />
        {RecordedAudio && isPlaying && (
          <span>{formatTime(CurrentPlayBackTime)}</span>
        )}
        {RecordedAudio && !isPlaying && (
          <span>{formatTime(TotalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>
      <div className="mr-4">
        {!Recording ? (
          <FaMicrophone
            onClick={handleStartRecording}
            className={`${IconStyle} text-red-500`}
          />
        ) : (
          <FaRegPauseCircle
            onClick={handleStopRecording}
            className={`${IconStyle} text-red-500`}
          />
        )}
      </div>
      <MdSend className={`${IconStyle}`} onClick={sendRecording} title="send" />
    </div>
  );
};

export default AudioMessage;
