const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); 

const ChatRoomSchema = new mongoose.Schema({
  roomId: { type: String, default: uuidv4, unique: true },
  name: { type: String, required: true },
  isGroup: { type: Boolean, default: false },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  isDirectMessage: { type: Boolean, default: false }, 
});

ChatRoomSchema.index({ users: 1, isDirectMessage: 1 }, { unique: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
