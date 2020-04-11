const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: [process.env.FRONTEND_URI, process.env.LOCALHOST],
  credentials: true,
};

const userRouter = require("./routes/users.routes");
const motivRouter = require("./routes/motiv.routes");

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/motivs", motivRouter);

app.get("/", (req, res) => {
  res.json({
    "0": "POST /users/newuser",
    "1": "POST /users/login",
    "2": "POST /users/logout",
    "3": "GET /motivs",
    "4": "GET /motivs/:motivId",
    "5": "POST /motivs",
    "6": "PATCH /motivs/:motivId/likes",
    "7": "PATCH /motivs/:motivId/comments",
    "8": "PATCH /motivs/:motivId/emotions",
    "9": "PATCH /users/userId",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.json({ error: err.message });
  } else {
    res.json({ error: "Internal server error." });
  }
});

module.exports = app;
