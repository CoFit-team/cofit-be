const mongoose = require("mongoose");

const emotionSchema = new mongoose.Schema
  ({
    emotionValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  });

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  email: String,
  likeWallet: {
    type: Number,
    min: 0,
    max: 9999,
  },
  emotion: [emotionSchema],
});

userSchema.path("email").validate(function (email) {
  const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRegex.test(email);
}, "The e-mail field cannot be empty.");

userSchema.path("password").validate(function (password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
}, "Password must be at least 8 characters long and contain 1 number, 1 uppercase and 1 lower case letters.");

const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
