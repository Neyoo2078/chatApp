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
      const SocketInstance = new (ClientIo as any)(
        process.env.NEXT_PUBLIC_SITE_URL,
        { path: '/api/socket/io', addTrailingSlash: false }
      );
      console.log({ evvvv: process.env.NEXT_PUBLIC_SITE_URL });

      SocketInstance.on('connect', (socket: any) => {
        setisConnected(true);
        console.log({ newSocket: socket });
      });
      SocketInstance.on('disconnect', () => {
        setisConnected(false);
      });
      setSocket(SocketInstance);
    }
  }, [currentUser]);

  return (
    <SocketContext.Provider value={{ socket: Socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
