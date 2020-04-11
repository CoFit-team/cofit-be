const mongoose = require("mongoose");

const userIdSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    message: String,
  },
  {
    timestamps: true,
  }
);

const motivSchema = new mongoose.Schema(
  {
    motivId: {
      type: String,
      required: true,
      unique: true,
    },
    imageURL: {
      type: String,
    },
    text: String,
    commentArray: [commentSchema],
    likes: {
      type: Number,
      min: 0,
      max: 9999,
      default: 00,
    },
    likesArray: [userIdSchema],
  },
  {
    timestamps: true,
  }
);

motivSchema.index(
  { "likesArray.userId": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "likesArray.userId": { $exists: true },
    },
  }
);

const MotivModel = mongoose.model("Motiv", motivSchema);
module.exports = MotivModel;
