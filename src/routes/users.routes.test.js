const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const UserModel = require("../models/users.model");

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("user.routes.js", () => {
  let mongoServer;
  let signedInAgent;
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
    jest.resetAllMocks();
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
      expect(err.error).toEqual(
        'E11000 duplicate key error dup key: { : "kushellwood" }'
      );
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
      expect(err.error).toEqual(
        "User validation failed: password: Password must be at least 8 characters long and contain 1 number, 1 uppercase and 1 lower case letters."
      );
    });
    it("POST /login should allow user login if username and password is valid", async () => {
      const mockUser = {
        username: "kushellwood",
        password: "Abcd12345",
      };
      const { text } = await request(app)
        .post("/users/login")
        .send(mockUser)
        .expect(200);
      expect(text).toEqual("You are now logged in!");
    });

    it("POST /login should not allow user login if username and password is invalid", async () => {
      const mockUser = {
        username: "kushellwood",
        password: "Bbcd12345",
      };
      const { body } = await request(app)
        .post("/users/login")
        .send(mockUser)
        .expect(401);
      expect(body.error).toEqual("Login failed.");
    });

    it("POST /logout should log the user out", async () => {
      const { text } = await request(app).post("/users/logout").expect(200);
      expect(text).toEqual("You are now logged out!");
    });

    it("PATCH /userId should allow the user to change username / password if user is logged in", async () => {
      const editFirstUser = {
        username: "kushellwood",
        password: "Abcd12345678",
        userId: "80145006-0804-4316-a057-77a658cf14dc",
      };
      jwt.verify.mockReturnValueOnce({ userId: editFirstUser.userId });
      signedInAgent = request(app);
      const { body: actualUser } = await signedInAgent
        .patch(`/users/${editFirstUser.userId}`)
        .set("Cookie", "token=valid-token")
        .send(editFirstUser)
        .expect(200);
      expect(actualUser).toMatchObject(editFirstUser);
    });
    it("PATCH /userId should allow the user to change username / password if user is logged in", async () => {
      const editFirstUser = {
        username: "kushellwood",
        password: "Abcd12345678",
        userId: "80145006-0804-4316-a057-77a658cf14dc",
      };
      let signedInAgent = request(app);
      const { body: actualUser } = await signedInAgent
        .patch(`/users/${editFirstUser.userId}`)
        .set("Cookie", "token=valid-token")
        .send(editFirstUser)
        .expect(200);
      expect(actualUser).toMatchObject(editFirstUser);
    });
    it("PATCH /userId should not allow the user to change username / password if user is logged in", async () => {
      const editFirstUser = {
        username: "kushellwood",
        password: "Abcd12345678",
        userId: "80145006-0804-4316-a057-77a658cf14dc",
      };
      const { body: err } = await request(app)
        .patch(`/users/${editFirstUser.userId}`)
        .send(editFirstUser)
        .expect(401);
      expect(err.error).toEqual("You are not authorized!");
    });
  });
});

// "PATCH /users/userId",
