const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const { populate } = require("../models/user");

function initializeSocket(server) {
  const { Server } = require("socket.io");

  const io = new Server(server, {
    cors: {
      origin: "*", // Allow requests from your Angular frontend
      methods: ["GET", "POST"], // Allow specific HTTP methods
      credentials: true, // Allow cookies to be sent if needed
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Handle joining a chat room
    socket.on("join room", async ({ roomId, userId }) => {
      try {
        const chatRoom = await ChatRoom.findOne({ roomId });
        if (!chatRoom) {
          return socket.emit("error", { message: "Chat room not found" });
        }

        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      } catch (err) {
        console.error(err);
        socket.emit("error", { message: "Server error" });
      }
    });

    socket.on(
      "chat message",
      async ({ roomId, userId, message, imageUrlmessageId }) => {
        try {
          console.log("from socket", roomId, userId, imageUrlmessageId);
          if (imageUrlmessageId) {
            const ImageMessage = await Message.findById(imageUrlmessageId)
              .populate("senderId")
              .exec();
            io.to(roomId).emit("chat message", ImageMessage);
          } else {
            const chatRoom = await ChatRoom.findOne({ roomId });
            if (!chatRoom) {
              return socket.emit("error", { message: "Chat room not found" });
            }

            const newMessage = new Message({
              chatRoomId: chatRoom._id,
              senderId: userId,
              content: message || null,
              timestamp: new Date(),
            });

            await newMessage.save();

            const populatedMessage = await Message.findById(newMessage._id)
              .populate("senderId")
              .exec();

            io.to(roomId).emit("chat message", populatedMessage);
          }
        } catch (err) {
          console.error(err);
          socket.emit("error", { message: "Server error" });
        }
      }
    );

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}

module.exports = initializeSocket;
