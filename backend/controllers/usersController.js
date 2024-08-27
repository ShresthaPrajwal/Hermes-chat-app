const bcrypt = require("bcryptjs/dist/bcrypt");
const User = require("../models/user");
const { uploadPhotoToFirebase } = require("../utils/firebaseUtils");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password -__v')  
      .populate('friends', 'username email profilePicture') 
      .populate('friendRequestsSent', 'toUser status')  
      .populate('friendRequestsReceived', 'fromUser status');

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const updateProfilePicture = async (req, res) => {
  const { userId } = req.params;
  const file = req.file;

  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const photoUrl = await uploadPhotoToFirebase(file);

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: photoUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile picture updated successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateUserPassword = async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword });
    res.json({updatedUser,message:'Password Updated Succesfully'})
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
};

module.exports = {
  updateProfilePicture,
  getAllUsers,
  updateUserPassword
};
