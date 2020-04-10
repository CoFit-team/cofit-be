const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserModel = require("../models/users.model");

// const {
//     mongooseBeforeAll,
//     mongooseTearDown
//   } = require("../utils/mongooseTest");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("user.routes.js", () => {
  let mongoServer;
  beforeAll(async () => {
    try {
      mongoServer = new MongoMemoryServer();
      const mongoUri = await mongoServer.getConnectionString();
      await mongoose.connect(mongoUri);
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const mockFirstUser = {
      username: "kushellwood",
      password: "Abcd12345",
      email: "testing124@gmail.com",
      userId: "80145006-0804-4316-a057-77a658cf14dc",
    };
    await UserModel.create(mockFirstUser);
  });

  afterEach(async () => {
    await UserModel.deleteMany();
  });

  describe("/users", () => {
    it("POST /newuser should return new user with status 201", async () => {
      const mockUser = {
        username: "chaimvasquez",
        password: "Abcd12345",
        email: "testing12@gmail.com",
      };
      const { body } = await request(app)
        .post("/users/newuser")
        .send(mockUser)
        .expect(201);
      expect(body.username).toEqual(mockUser.username);
      expect(body.password).not.toEqual(mockUser.password);
    });
    it("POST /newuser should return status 422 when username already exist", async () => {
      const mockUser = {
        username: "kushellwood",
        password: "Abcd12345",
        email: "testing123@gmail.com",
      };
      const { body: err } = await request(app)
        .post("/users/newuser")
        .send(mockUser)
        .expect(422);
    });

    it("POST /newuser should return status 400 when password fails validation", async () => {
      const mockUser = {
        username: "chaimvasquez",
        password: "abcd12345",
        email: "testing123@gmail.com",
      };
      const { body: err } = await request(app)
        .post("/users/newuser")
        .send(mockUser)
        .expect(400);
    });
    it("POST /login should allow user login if username and password is valid", async () => {
      const mockUser = {
        username: "kushellwood",
        password: "Abcd12345",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(mockUser)
        .expect(200);
    });
  });
});
