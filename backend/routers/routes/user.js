const userRouter = require("express").Router();
const usersController = require("../../controllers/usersController");
const upload = require("../../middlewares/multerMiddleware");

userRouter.get("/", (req, res) => {
  res.json({ message: "user" });
});

userRouter.put(
  "/users/:userId/profile-picture",
  upload.single("profilePicture"),
  usersController.updateProfilePicture
);

module.exports = userRouter;
