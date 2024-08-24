const FriendRequest = require("../models/friendRequest");
const User = require("../models/user");
const mongoose = require("mongoose");

const getFriends = async (req, res) => {
  const { userId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const user = await User.findById(userObjectId).populate(
      "friends",
      "username email profilePicture gender"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ friends: user.friends });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const sendFriendRequest = async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(senderId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingRequest = await FriendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
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

    res
      .status(201)
      .json({ message: "Friend request sent successfully", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const acceptFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }

    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    request.status = "accepted";
    await request.save();

    sender.friends.push(receiver._id);
    receiver.friends.push(sender._id);

    await sender.save();
    await receiver.save();

    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => !id.equals(request._id)
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => !id.equals(request._id)
    );

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request accepted", sender, receiver });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const rejectFriendRequest = async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);

    if (!request || request.status !== "pending") {
      return res
        .status(404)
        .json({ message: "Request not found or already processed" });
    }

    const sender = await User.findById(request.sender);
    const receiver = await User.findById(request.receiver);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    request.status = "rejected";
    await request.save();

    receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
      (id) => !id.equals(request._id)
    );
    sender.friendRequestsSent = sender.friendRequestsSent.filter(
      (id) => !id.equals(request._id)
    );

    await receiver.save();
    await sender.save();

    res.json({ message: "Friend request rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
