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

  beforeEach(() => {});

  afterEach(() => {});
  describe("/users", () => {
    it("POST /newuser should return new user with status 201", async () => {
      const mockUser = {
        username: "chaimvasquez",
        password: "Abcd12345",
        email: "testing123@gmail.com",
      };
      const { body } = await request(app)
        .post("/users/newuser")
        .send(mockUser)
        .expect(201);
      expect(body).toMatchObject(mockUser);
    });
    // it("POST /newuser should return new user with status 201", async ()=> {
    //   const mockUser = {
    //     username: "Chaim Vasquez",
    //     password: "abcd12345",
    //     email: "testing123@gmail.com",
    //   }
    //   const {body} = await request(app).post("/users/newuser").send(mockUser).expect(201);
    //   expect(body).toThrow("")
    // })
  });
});
