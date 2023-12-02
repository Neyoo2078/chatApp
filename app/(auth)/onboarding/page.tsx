'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { AiOutlineCamera } from 'react-icons/ai';
import { useState, useRef } from 'react';
import MenuItem from '@/components/MenuItem';
import { SiWhatsapp } from 'react-icons/si';
import { RiWhatsappFill } from 'react-icons/ri';
import PhotoPicker from '@/components/PhotoPicker';
import { useEffect } from 'react';
import PhotoLib from '@/components/PhotoLib';
import { useFormik } from 'formik';
import Camera from '@/components/Camera';
import Validate from '@/components/Validate';
import { RoundaboutRightSharp } from '@mui/icons-material';
import { getUser, UpdateProfile } from '@/lib/Actions/UserActions';
const page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [userData, setuserData] = useState<any>(null);
  const [Hover, setHover] = useState(false);
  const [Coordinate, setCoodinate] = useState({ x: 0, y: 0 });

  const [showContextMenu, setshowContextMenu] = useState(false);
  const [image, setimage] = useState('/default_avatar.png');
  const [GrabPhoto, setGrabPhoto] = useState(false);
  const [ShowPhotoLib, setShowPhotoLib] = useState(false);
  const [ShowCamera, setShowCamera] = useState(false);

  const [updateData, setupDate] = useState<any>({
    avatar: '/default_avatar.png',
  });

  // get userb data fro DB
  const getUserFromDb = async () => {
    const res: any = await getUser({
      name: session?.user?.name,
      email: session?.user?.email,
      image: session?.user?.image,
    });
    setuserData(JSON.parse(res));
  };
  useEffect(() => {
    if (userData) {
      if (!userData.newUser) {
        router.push('/');
      }
    }
  }, [userData]);

  useEffect(() => {
    if (session) {
      getUserFromDb();
    }
  }, [session]);
  // update image
  useEffect(() => {
    setupDate({ ...updateData, avatar: image });
  }, [image]);

  const formik = useFormik({
    initialValues: {
      displayName: '',
      about: '',
    },

    onSubmit: async (values) => {
      UpdateProfile({
        avatar: updateData?.avatar,
        about: values.about,
        displayName: values.displayName,
        newUser: false,
        id: userData?._id,
      });
      router.push('/');
    },
    validate: Validate,
  });

  useEffect(() => {
    if (GrabPhoto) {
      const data: HTMLElement | null = document.getElementById('photo-picker');
      data?.click();
      document.body.onfocus = (e) => {
        setTimeout(() => {
          setGrabPhoto(false);
        }, 1000);
      };
    }
  }, [GrabPhoto]);
  const options = [
    {
      name: 'Take Photos',
    },
    { name: 'Choose from Library' },
    { name: 'Upload Photo' },
    { name: 'Remove Photo' },
  ];

  const photoPickChange = async (e: any) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data: any = document.createElement('img');
    reader.onload = function (event: any) {
      data.src = event.target.result;
      data.setAttribute('data-src', event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setimage(data.src);
    }, 1000);
  };
  return (
    <div className="flex h-screen bg-whatapp-bg w-full m-auto flex-col items-center justify-center p-24">
      <div className="flex gap-2 md:gap-3 w-full items-center justify-center ">
        <RiWhatsappFill className=" w-[100px] h-[75px] md:w-[200px] md:h-[150px] text-[#25D366]" />
        <h1 className=" text-[25px] md:text-[50px] text-[#fff]">WhatsApp</h1>
      </div>
      <h1 className="text-white text-[15px] md:text-[20px]">
        Create your Profile
      </h1>
      <div className="flex gap-3  flex-col-reverse md:flex-row  items-center justify-center">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-2">
          <label className="text-white text-[12px]">Display Name:</label>
          {formik.errors.displayName && formik.touched.displayName && (
            <h1 className="text-[#d52626]">{formik.errors.displayName}</h1>
          )}
          <input
            className=" p-2 rounded-sm"
            placeholder="Display Name"
            {...formik.getFieldProps('displayName')}
          />
          <label className="text-white text-[12px]">About:</label>
          {formik.errors.about && formik.touched.about && (
            <h1 className="text-[#d52626]">{formik.errors.about}</h1>
          )}
          <input
            className=" p-2 rounded-sm"
            placeholder="About"
            {...formik.getFieldProps('about')}
          />
          <button
            type="submit"
            className="p-2 text-white bg-[#25D366]/50 rounded-sm"
          >
            Update Profile
          </button>
        </form>
        <div
          onMouseLeave={() => {
            setHover(false);
          }}
          onMouseEnter={() => {
            setHover(true);
          }}
          className="relative flex items-center  justify-center w-[100px] h-[100px] md:w-[200px] md:h-[200px]"
          id="context-opener"
        >
          {/* <Image
            src={image}
            width={123}
            height={123}
            className="rounded-full md:hidden w-[200px]  h-[200px]"
            alt="profile_picture"
          /> */}
          <Image
            src={image}
            width={256}
            height={256}
            className="rounded-full w-[100px] h-[100px] md:w-[200px]  md:h-[200px]"
            alt="profile_picture"
          />
          <div
            onClick={(e) => {
              setCoodinate({ x: e.pageX, y: e.pageY });
              setshowContextMenu(!showContextMenu);
            }}
            className={`absolute ${
              Hover ? 'bg-black/40' : 'bg-transparent'
            } cursor-pointer opacity-50 rounded-full flex flex-col items-center justify-center text-white p-1 md:p-3 m-auto inset-0`}
          >
            {Hover && (
              <div className=" flex flex-col items-center justify-center">
                <AiOutlineCamera className="w-[45px] h-[45px]" />
                <h1 className="font-semibold text-[20px] text-white">
                  Add your avatar{' '}
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
      {GrabPhoto && <PhotoPicker change={photoPickChange} />}
      {ShowPhotoLib && (
        <PhotoLib setShowPhotoLib={setShowPhotoLib} setimage={setimage} />
      )}
      {ShowCamera && (
        <Camera setShowCamera={setShowCamera} setimage={setimage} />
      )}

      {showContextMenu && (
        <MenuItem
          Coordinate={Coordinate}
          options={options}
          showContextMenu={showContextMenu}
          setshowContextMenu={setshowContextMenu}
          setGrabPhoto={setGrabPhoto}
          setimage={setimage}
          setShowPhotoLib={setShowPhotoLib}
          setShowCamera={setShowCamera}
        />
      )}
    </div>
  );
};

export default page;
