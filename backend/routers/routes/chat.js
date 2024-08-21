const express = require('express');
const ChatController = require('../../controllers/chatController')
const chatRouter = express.Router();

chatRouter.get('/messages/:roomId', ChatController.getMessages);
chatRouter.post('/direct', ChatController.createOrGetChatRoom);

module.exports = chatRouter;
