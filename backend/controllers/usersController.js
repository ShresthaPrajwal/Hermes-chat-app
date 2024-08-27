const User = require("../models/user");
const { uploadPhotoToFirebase } = require("../utils/firebaseUtils");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');

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

module.exports = {
  updateProfilePicture,
  getAllUsers
};
