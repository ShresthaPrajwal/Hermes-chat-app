const express = require('express');
const ChatController = require('../../controllers/chatController')
const chatRouter = express.Router();

chatRouter.get('/messages/:roomId', ChatController.getMessages);
chatRouter.post('/direct', ChatController.createOrGetChatRoom);
chatRouter.post('/creategroup',ChatController.createGroupChat);
chatRouter.post('/addgroupmembers/:roomId',ChatController.addMembersToGroup);
chatRouter.get('/rooms/:userId',ChatController.getRooms);

module.exports = chatRouter;
