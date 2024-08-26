const ChatRoom = require("../models/chatRoom");
const Message = require("../models/message");
const User = require("../models/user");
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

    const users = [
      new mongoose.Types.ObjectId(userId1),
      new mongoose.Types.ObjectId(userId2),
    ].sort();

    let chatRoom = await ChatRoom.findOne({
      users: { $all: users, $size: users.length },
      isDirectMessage: true,
    });

    console.log("Found chatroom", chatRoom);

    if (!chatRoom) {
      const user1 = await User.findById(userId1);
      const user2 = await User.findById(userId2);

      chatRoom = new ChatRoom({
        users: users,
        isDirectMessage: true,
        name: `${user1.username}-${user2.username}`,
      });
      await chatRoom.save();
    }

    res.json({ roomId: chatRoom.roomId, chatRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const createGroupChat = async (req, res) => {
  const { name, userIds = [] } = req.body;

  try {
    const validUserIds = userIds.filter((userId) =>
      mongoose.Types.ObjectId.isValid(userId)
    );
    const users = validUserIds.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );

    const chatRoom = new ChatRoom({
      name,
      users: users,
      isGroup: true,
      isDirectMessage: false,
    });

    await chatRoom.save();

    res.status(201).json({ roomId: chatRoom.roomId, chatRoom });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const addMembersToGroup = async (req, res) => {
  const { roomId } = req.params;
  const { userIds } = req.body;
  console.log(roomId);
  try {
    const chatRoom = await ChatRoom.findOne({ roomId, isGroup: true });
    if (!chatRoom) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    const validUserIds = userIds.filter((userId) =>
      mongoose.Types.ObjectId.isValid(userId)
    );
    const newUsers = validUserIds.map(
      (userId) => new mongoose.Types.ObjectId(userId)
    );

    const usersToAdd = newUsers.filter(
      (userId) => !chatRoom.users.includes(userId)
    );

    if (usersToAdd.length === 0) {
      return res
        .status(400)
        .json({ message: "All users are already in the group" });
    }

    chatRoom.users.push(...usersToAdd);
    await chatRoom.save();

    res.json({
      message: "Members added successfully",
      roomId: chatRoom.roomId,
      chatRoom,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const removeMemberFromGroup = async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  try {
    const chatRoom = await ChatRoom.findOne({ roomId, isGroup: true });
    if (!chatRoom) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    chatRoom.users = chatRoom.users.filter(id => id.toString() !== userId.toString());
    await chatRoom.save();

    res.json({ message: "Member removed successfully", roomId: chatRoom.roomId ,chatRoom});
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

const getRooms = async (req, res) => {
  const { userId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const chatRooms = await ChatRoom.find({ users: userObjectId });

    if (!chatRooms.length) {
      return res.status(404).json({ message: "No chat rooms found" });
    }

    res.json(chatRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find();

    if (!chatRooms.length) {
      return res.status(404).json({ message: "No chat rooms available" });
    }

    res.json(chatRooms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createOrGetChatRoom,
  getMessages,
  getRooms,
  createGroupChat,
  addMembersToGroup,
  removeMemberFromGroup,
  getAllRooms
};
