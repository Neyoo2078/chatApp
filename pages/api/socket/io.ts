import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIo } from 'socket.io';
import { NextApiResponseServerIo } from '@/type';
import cors from 'cors';

const IoHandler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer = res.socket.server as any;
    const io = new ServerIo(httpServer, {
      path: path,
      addTrailingSlash: false,
    });
    // @ts-ignore
    const onlineUsers = new Map();
    io.on('connection', (socket) => {
      socket.on('join_room', (data) => {
        // socket.join(roomId);
        onlineUsers.set(data, socket.id);
        console.log(
          `user with id-${
            socket.id
          } joined with UserId - ${data} with onlineusers${Array.from(
            onlineUsers.keys()
          )}`
        );
        io.emit('online_users', {
          onlineUser: Array.from(onlineUsers.keys()),
        });
        // socket.broadcast.emit('online_users', {
        //   // onlineUser: Array.from(onlineUsers.keys()),
        //   bb: 'we here',
        // });
      });
      socket.on('Sign_out', (id) => {
        socket.broadcast.emit('online_users', {
          onlineUser: Array.from(onlineUsers.keys()),
        });
      });
      socket.on('send_msg', (data) => {
        const sendUserSocket = onlineUsers.get(data.receiverId);
        //This will send a message to a specific room ID
        // socket.to(data.roomId).emit('receive_msg', data);

        if (sendUserSocket) {
          socket.to(sendUserSocket).emit('recieve-msg', {
            senderId: data.from,
            message: data.message,
            messageStatus: data.messageStatus,
            messageType: data.messageType,
          });
        }
      });

      socket.on('disconnect', (id) => {
        console.log('A user disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default IoHandler;
