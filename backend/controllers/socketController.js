const Message = require('../models/message');
const ChatRoom = require('../models/chatRoom');

exports.handleSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('joinRoom', async ({ roomId, userId }) => {
      const chatRoom = await ChatRoom.findOne({ roomId });
      if (!chatRoom) {
        return socket.emit('error', 'Chat room not found');
      }

      socket.join(roomId);
      console.log(`${userId} joined room: ${roomId}`);
    });

    socket.on('sendMessage', async ({ roomId, senderId, content }) => {
      const chatRoom = await ChatRoom.findOne({ roomId });
      if (!chatRoom) {
        return socket.emit('error', 'Chat room not found');
      }

      const message = new Message({ chatRoomId: chatRoom._id, senderId, content });
      await message.save();

      io.to(roomId).emit('message', {
        roomId,
        senderId,
        content,
        timestamp: message.timestamp,
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};
