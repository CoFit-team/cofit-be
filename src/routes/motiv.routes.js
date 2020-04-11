const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");

const MotivModel = require("../models/motiv.model");
const { protectRoute } = require("../middlewares/auth");
const wrapAsync = require("../utils/wrapAsync");

const postMotiv = async (req, res, next) => {
  const motiv = req.body;
  const newMotiv = new MotivModel(motiv);
  await MotivModel.init();
  newMotiv.motivId = uuidv4();
  await newMotiv.save();
  res.status(201).json(newMotiv);
};

const getMotiv = async (req, res, next) => {
  const motivId = req.params.motivId;
  const motiv = !!motivId
    ? await MotivModel.findOne({ motivId })
    : await MotivModel.find({});
  res.status(200).send(motiv);
};

const addLikesToMotivs = async (req, res, next) => {
  const motivId = req.params.motivId;
  const { likes, userId } = req.body;
  const update = {
    $push: { likesArray: { userId } },
    $set: { likes },
  };
  const selectedMotiv = await MotivModel.findOneAndUpdate({ motivId }, update, {
    runValidators: true,
    new: true,
  });
  res.status(200).send(selectedMotiv);
};

const addCommentsToMotivs = async (req, res, next) => {
  const motivId = req.params.motivId;
  const { userId, message } = req.body;
  const update = {
    $push: { commentArray: { userId, message } },
  };
  const selectedMotiv = await MotivModel.findOneAndUpdate({ motivId }, update, {
    runValidators: true,
    new: true,
  });
  res.status(200).send(selectedMotiv);
};

router.post("/", protectRoute, wrapAsync(postMotiv));
router.get("/:motivId", wrapAsync(getMotiv));
router.get("/", wrapAsync(getMotiv));
router.patch("/:motivId/likes", wrapAsync(addLikesToMotivs));
router.patch(
  "/:motivId/comments",
  protectRoute,
  wrapAsync(addCommentsToMotivs)
);

router.use((err, req, res, next) => {
  if (err.name === "ValidationError") {
    err.statusCode = 400;
  }
  if (err.name === "MongoError" && err.code === 11000) {
    err.statusCode = 422;
  }
  next(err);
});

module.exports = router;
