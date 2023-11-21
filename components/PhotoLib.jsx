import Image from 'next/image';
import { AiOutlineClose } from 'react-icons/ai';

const PhotoLib = ({ setShowPhotoLib, setimage }) => {
  const Avatars = [
    { avatar: '/avatars/1.png' },
    { avatar: '/avatars/2.png' },
    { avatar: '/avatars/3.png' },
    { avatar: '/avatars/4.png' },
    { avatar: '/avatars/5.png' },
    { avatar: '/avatars/6.png' },
    { avatar: '/avatars/7.png' },
    { avatar: '/avatars/8.png' },
    { avatar: '/avatars/9.png' },
  ];
  return (
    <div className="fixed top-0 left-0 flex items-center inset-0 justify-center md:min-h-[100vh] md:p-3 md:min-w-[100vh] h-full w-full ">
      <div className=" h-full md:h-[50%] md:min-h-[50%] relative w-full md:w-[40%] flex items-center justify-center bg-gray-900/70 gap-1 md:gap-6 rounded-lg p-1 md:p-6 ">
        <AiOutlineClose
          className="text-white w-10 left-1 absolute top-1 h-10 cursor-pointer"
          onClick={() => {
            setShowPhotoLib(false);
          }}
        />
        <div className="grid grid-cols-3 gap-7 md:mt-8 justify-center items-center">
          {Avatars.map((items, i) => (
            <Image
              key={i}
              src={items.avatar}
              width={82}
              height={82}
              onClick={() => {
                setimage(items.avatar);
                setShowPhotoLib(false);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoLib;
