const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserModel = require("../models/users.model");
const { createJWTToken } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");

const registerNewUser = async (res, req, next) => {
  const user = req.body;
  const newUser = await UserModel(user);
  await UserModel.init();
  newUser.userId = uuidv4();
  await newUser.save();
  res.status(201).json(newUser);
};

const logOutUser = (res, req, next) => {
  res.clearCookie("token").send("You are now logged out!");
};

const loginUser = async (res, req, next) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    throw new Error("Login failed");
  }
  const payload = createJWTToken(user.userId, user.username);
  const timeInMs = 24 * 60 * 60 * 1000;
  const expiryDate = new Date(Date.now() + timeInMs);
  res.cookie("token", payload, { expires: expiryDate });
  res.send("You are now logged in!");
};

router.post("/newuser", wrapAsync(registerNewUser));
router.post("/login", wrapAsync(loginUser));
router.post("/logout", wrapAsync(logOutUser));

module.exports = router;
