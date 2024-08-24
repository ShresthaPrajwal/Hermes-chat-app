const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');
const mongoose = require("mongoose");

const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: 'pending',
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    const request = new FriendRequest({
      sender: senderId,
      receiver: receiverId,
    });

    await request.save();

    sender.friendRequestsSent.push(request._id);
    receiver.friendRequestsReceived.push(request._id);

    await sender.save();
    await receiver.save();

    res.status(201).json({ message: 'Friend request sent successfully', request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
    sendFriendRequest
}