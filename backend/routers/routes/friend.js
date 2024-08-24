const friendRouter = require("express").Router();
const friendController = require("../../controllers/friendsController");

friendRouter.get("/", (req, res) => {
  res.json({ message: "friend" });
});

friendRouter.post('/friendRequest',friendController.sendFriendRequest);
friendRouter.post('/acceptRequest',friendController.acceptFriendRequest);

module.exports = friendRouter;
