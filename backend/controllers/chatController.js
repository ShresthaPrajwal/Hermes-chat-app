const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const mongoose = require("mongoose");

const createOrGetChatRoom = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(userId1) ||
      !mongoose.Types.ObjectId.isValid(userId2)
    ) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user1ObjectId = new mongoose.Types.ObjectId(userId1);
    const user2ObjectId = new mongoose.Types.ObjectId(userId2);

    let chatRoom = await ChatRoom.findOne({
      users: { $all: [user1ObjectId, user2ObjectId] },
      isDirectMessage: true,
    });

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        name: "Direct Message",
        users: [userId1, userId2],
        isDirectMessage: true,
      });
      await chatRoom.save();
    }

    res.json({ roomId: chatRoom.roomId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getMessages = async (req, res) => {
  const { roomId } = req.params;
  try {
    const chatRoom = await ChatRoom.findOne({ roomId });
    if (!chatRoom) {
      return res.status(404).json({ message: "Chat room not found" });
    }

    const messages = await Message.find({ chatRoomId: chatRoom._id })
      .populate("senderId", "username")
      .sort("timestamp");
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrGetChatRoom,
  getMessages,
};
