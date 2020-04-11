const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/users.model");
const { protectRoute, createJWTToken } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");

const registerNewUser = async (req, res, next) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await UserModel.init();
  newUser.userId = uuidv4();
  await newUser.save();
  res.status(201).json(newUser);
};

const logOutUser = (req, res, next) => {
  res.clearCookie("token").send("You are now logged out!");
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    throw new Error("Login failed.");
  }
  const token = createJWTToken(user.userId, user.username);
  const timeInMs = 24 * 60 * 60 * 1000;
  const expiryDate = new Date(Date.now() + timeInMs);
  res.cookie("token", token, { expires: expiryDate });
  res.status(200).send("You are now logged in!");
};

const patchUser = async (req, res, next) => {
  const userId = req.params.userId;
  const newUserData = req.body;
  const updatedUser = await UserModel.findOneAndUpdate(
    { userId },
    newUserData,
    { new: true }
  );
  res.status(200).send(updatedUser);
};

const addEmotionsToUsers = async (req, res, next) => {
  const userId = req.params.userId;
  const { emotionValue } = req.body;
  const update = {
    $push: { emotion: { emotionValue } },
  };
  const updatedUser = await UserModel.findOneAndUpdate({ userId }, update, {
    runValidators: true,
    new: true,
  });
  res.status(200).send(updatedUser);
};

router.post("/newuser", wrapAsync(registerNewUser));
router.post("/login", wrapAsync(loginUser));
router.post("/logout", wrapAsync(logOutUser));
router.patch("/:userId", protectRoute, wrapAsync(patchUser));
router.patch("/:userId/emotions", protectRoute, wrapAsync(addEmotionsToUsers));

router.use((err, req, res, next) => {
  if (err.message === "Login failed.") {
    err.statusCode = 401;
  }

  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "MongoError" && err.code === 11000) {
    err.statusCode = 422;
  }
  next(err);
});

module.exports = router;
