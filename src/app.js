const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");


const corsOptions = {
  origin: [process.env.FRONTEND_URI],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

const userRouter = require("./routes/users.routes")
app.use("/users", userRouter)

// const motivRouter = require("./routes/motiv.routes")
// app.use("./motiv", motivRouter)

app.get("/", (req, res) => {
  res.json({
    "0": "POST /users/newuser",
    "1": "PATCH /users/userId",
    "2": "GET /users",
    "3": "POST /users/login",
    "4": "GET /motivs",
    "5": "POST /motivs",
    "6": "PATCH /motivs?id=motivId/likes",
    "7": "PATCH /motivs?id=motivId/comments",
  });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500);
  console.log(err);
  if (err.statusCode) {
    res.send({ error: err.message });
  } else {
    res.send({ error: "Internal server error." });
  }
});


module.exports = app;
