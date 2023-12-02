'use client';
import { useContext, useEffect, useState } from 'react';
import { io as ClientIo } from 'socket.io-client';
import { createContext } from 'react';
import { useAppSelector } from '@/Redux/hooks';

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [Socket, setSocket] = useState(null);
  const [isConnected, setisConnected] = useState(false);
  // use Selector
  const { currentUser } = useAppSelector((state) => state.Users);
  // @ts-ignore
  global.onlineUsers = new Map();

  useEffect(() => {
    if (currentUser) {
      // const SocketInstance = new (ClientIo as any)(
      //   process.env.NEXT_PUBLIC_SITE_URL,
      //   { addTrailingSlash: false }
      // );
      const SocketInstance = ClientIo('http://localhost:5000');
      console.log({ evvvv: process.env.NEXT_PUBLIC_SITE_URL });

      SocketInstance.on('connect', () => {
        setisConnected(true);
      });
      SocketInstance.on('disconnect', () => {
        setisConnected(false);
      });
      // @ts-ignore
      setSocket(SocketInstance);
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket: Socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
