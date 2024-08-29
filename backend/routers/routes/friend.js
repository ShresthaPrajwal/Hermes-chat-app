const friendRouter = require("express").Router();
const friendController = require("../../controllers/friendsController");

friendRouter.get("/", (req, res) => {
  res.json({ message: "friend" });
});

friendRouter.get('/getFriends/:userId',friendController.getFriends);
friendRouter.get('/getFriendRequests/:userId',friendController.getFriendRequestsByUserId)
friendRouter.post('/friendRequest',friendController.sendFriendRequest);
friendRouter.post('/acceptRequest',friendController.acceptFriendRequest);
friendRouter.post('/rejectRequest',friendController.rejectFriendRequest);

module.exports = friendRouter;
