const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    default: "Male",
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  friendRequestsSent: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FriendRequest',
    },
  ],
  friendRequestsReceived: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FriendRequest',
    },
  ],
});

UserSchema.virtual("userId").get(function () {
  return this._id.toHexString();
});

UserSchema.set("toJSON", {
  virtuals: true,
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
