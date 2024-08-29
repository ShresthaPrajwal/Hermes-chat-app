const express = require('express')
const SocketController = require('../../controllers/socketController');
const socketRouter = express.Router();

socketRouter.post('/connect',SocketController.handleSocketConnection);

module.exports = socketRouter;