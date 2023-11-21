import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useRef } from 'react';

const Camera = ({ setShowCamera, setimage }) => {
  const videoRef = useRef();
  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
    };
    startCamera();
    return () => {
      stream?.getTracks()?.forEach((track) => track.stop());
    };
  }, []);

  const capturePhoto = () => {
    const canvas = document.createElement('canvas');
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0, 300, 150);
    setimage(canvas.toDataURL('image/jpeg'));
    setShowCamera(false);
  };

  return (
    <div className="absolute w-full h-full md:h-4/6 md:w-2/6  top-0 left-0 md:top-1/4 md:left-1/3 bg-gray-900">
      <div className="flex flex-col gap-4 items-center w-full">
        <div className="pt-2 text-white pr-2 cursor-pointer flex items-end justify-end">
          <AiOutlineClose
            onClick={() => {
              setShowCamera(false);
            }}
          />
        </div>
        <div className="flex justify-center">
          <video id="video" width="400" autoPlay ref={videoRef} />{' '}
        </div>
        <button
          onClick={capturePhoto}
          className="h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-[#25D366]"
        ></button>
      </div>
    </div>
  );
};

export default Camera;
