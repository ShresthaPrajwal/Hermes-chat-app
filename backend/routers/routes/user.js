const userRouter = require("express").Router();
const usersController = require("../../controllers/usersController");
const upload = require("../../middlewares/multerMiddleware");

userRouter.get("/", (req, res) => {
  res.json({ message: "user" });
});


userRouter.get("/allusers",usersController.getAllUsers);
userRouter.put(
  "/profile/:userId/profile-picture",
  upload.single("profilePicture"),
  usersController.updateProfilePicture
);
userRouter.put('/profile/password',usersController.updateUserPassword);

module.exports = userRouter;
