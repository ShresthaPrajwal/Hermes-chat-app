const friendRouter = require("express").Router();
const friendController = require("../../controllers/friendsController");

friendRouter.get("/", (req, res) => {
  res.json({ message: "friend" });
});

friendRouter.post('/friendRequest',friendController.sendFriendRequest);

module.exports = friendRouter;
