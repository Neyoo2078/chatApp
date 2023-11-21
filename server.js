const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const httpServer = http.createServer();

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your frontend URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

global.onlineUsers = new Map();
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
    socket.broadcast.emit('online_users', {
      onlineUser: Array.from(onlineUsers.keys()),
    });
  });

  socket.on('send_msg', (data) => {
    console.log(data, 'DATA');
    console.log({ onlineUsers });
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

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Socket.io server is running on port ${PORT}`);
});
