const jwt = require("jsonwebtoken");
const User = require("../models/user");
const config = require("../config/config");
const { v4: uuidv4 } = require("uuid");

// Register a new user
const register = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (username === "" || password === "" || email === "") {
      return res.status(401).json({
        error: "Username and Password and email cannot be empty",
      });
    }
    const user = new User({ username, password, email });
    await user.save();

    res
      .status(201)
      .json({ message: "User registered successfully", userId: user.userId , user});
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Username already exists. Please choose another one.",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login a user
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (username === "" && password === "") {
      return res.status(401).json({
        error: "Empty Username and Password",
      });
    }
    if (username === "") {
      return res.status(401).json({
        error: "Empty Username",
      });
    }
    if (password === "") {
      return res.status(401).json({
        error: "Empty Password",
      });
    }
    console.log('Username,pass',username,password)
    const user = await User.findOne({ username });
      console.log('user',user)
    let matchPasswordcheck = await user.matchPassword(password);
    if (!user || !matchPasswordcheck) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, config.SECRET_KEY, {
      expiresIn: "10000h",
    });

    res.json({ username: username, userId: user.userId, token , user});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
};
