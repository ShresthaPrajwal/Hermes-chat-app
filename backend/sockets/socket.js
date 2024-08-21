// socket.js

const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");

function initializeSocket(server) {
    const { Server } = require('socket.io');
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle joining a chat room
        socket.on('join room', async ({ roomId, userId }) => {
            try {
                const chatRoom = await ChatRoom.findOne({ roomId });
                if (!chatRoom) {
                    return socket.emit('error', { message: 'Chat room not found' });
                }

                socket.join(roomId);
                console.log(`User ${userId} joined room ${roomId}`);
            } catch (err) {
                console.error(err);
                socket.emit('error', { message: 'Server error' });
            }
        });

        // Handle sending a message to a chat room
        socket.on('chat message', async ({ roomId, userId, message }) => {
            try {
                const chatRoom = await ChatRoom.findOne({ roomId });
                if (!chatRoom) {
                    return socket.emit('error', { message: 'Chat room not found' });
                }

                const newMessage = new Message({
                    chatRoomId: chatRoom._id,
                    senderId: userId,
                    content: message,
                    timestamp: new Date(),
                });

                await newMessage.save();

                // Emit the message to the room
                io.to(roomId).emit('chat message', {
                    message,
                    userId,
                    timestamp: newMessage.timestamp,
                });
            } catch (err) {
                console.error(err);
                socket.emit('error', { message: 'Server error' });
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
}

module.exports = initializeSocket;
