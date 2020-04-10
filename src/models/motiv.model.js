const mongoose = require("mongoose");

const userIdSchema = {
  id: {
    type: String,
    required: true,
    unique: true,
    immutable: true,
  },
};

const commentSchema =
  ({
    userId: userIdSchema,
    message: String,
  },
  {
    timestamps: true,
  });

const motivSchema = new mongoose.Schema(
  {
    motivId: {
      type: String,
      required: true,
      unique: true,
    },
    imageURL: {
      type: String,
      unique: true,
    },
    text: String,
    commentArray: [commentSchema],
    likes: {
      type: Number,
      min: 0,
      max: 9999,
    },
    likesArray: [userIdSchema],
  },
  {
    timestamps: true,
  }
);

motivSchema.index(
  { "likesArray.id": 1 },
  {
    unique: true,
    partialFilterExpression: {
      "likesArray.id": { $exists: true },
    },
  }
);

const MotivModel = mongoose.model("Motiv", motivSchema);
module.exports = MotivModel;
