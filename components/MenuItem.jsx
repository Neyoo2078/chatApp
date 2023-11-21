'use client';
import { useRef } from 'react';
import { useEffect } from 'react';

const MenuItem = ({
  Coordinate,
  options,
  showContextMenu,
  setshowContextMenu,
  setGrabPhoto,
  setimage,
  setShowPhotoLib,
  setShowCamera,
}) => {
  const MenuList = useRef(null);
  const MenuHandler = (name) => {
    if (name === 'Upload Photo') {
      setGrabPhoto(true);
      return;
    }
    if (name === 'Remove Photo') {
      setimage('/default_avatar.png');
      return;
    }
    if (name === 'Choose from Library') {
      setShowPhotoLib(true);
      return;
    }
    if (name === 'Take Photos') {
      setShowCamera(true);
      return;
    }
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (e.target.id !== 'context-opener') {
        if (MenuList.current && !MenuList.current.contains(e.target)) {
          setshowContextMenu(false);
        }
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <div
      className={`bg-black/50  text-white p-3 z-100 fixed shadow-xl `}
      ref={MenuList}
      style={{ top: Coordinate.y, left: Coordinate.x }}
    >
      <ul className="">
        {options.map((items, i) => (
          <li
            key={i}
            onClick={(e) => {
              MenuHandler(items.name);
              setshowContextMenu(!showContextMenu);
            }}
            className="py-2 cursor-pointer hover:text-gray-200"
          >
            {items.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuItem;
