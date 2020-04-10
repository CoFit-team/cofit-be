const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const corsOptions = {
  origin: [process.env.FRONTEND_URI],
  credentials: true,
};

const userRouter = require("./routes/users.routes");

app.use(express.json());
// app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// const motivRouter = require("./routes/motiv.routes")
// app.use("./motiv", motivRouter)

app.use("/users", userRouter);

app.get("/", (req, res) => {
  res.json({
    "0": "POST /users/newuser",
    "1": "POST /users/login",
    "2": "POST /users/logout",
    "3": "GET /motivs",
    "4": "POST /motivs",
    "5": "PATCH /motivs?id=motivId/likes",
    "6": "PATCH /motivs?id=motivId/comments",
    "7": "PATCH /users/userId",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error." });
  }
});

module.exports = app;
