const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const MotivModel = require("../models/motiv.model");
const UserModel = require("../models/users.model");

const jwt = require("jsonwebtoken");
jest.mock("jsonwebtoken");

mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);

describe("motiv.routes.js", () => {
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
    const mockFirstMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c66",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User1_10042020.jpeg",
      text: "Circuit Breaker Day 1",
      likes: 20,
    };
    const mockSecondMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c67",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User3_10042020.jpeg",
      text: "Circuit Breaker Day 3",
      likes: 200,
    };
    await UserModel.create(mockFirstUser);
    await MotivModel.create(mockFirstMotiv);
    await MotivModel.create(mockSecondMotiv);
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await MotivModel.deleteMany();
    await UserModel.deleteMany();
  });

  it("POST /motivs should return 201 when the motiv is posted", async () => {
    const mockMotiv = {
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User2_10042020.jpeg",
      text: "Circuit Breaker Day 2",
      likes: 20,
    };
    let signedInAgent = request(app);
    const { body } = await signedInAgent
      .post("/motivs")
      .set("Cookie", "token=valid-token")
      .send(mockMotiv)
      .expect(201);
    expect(body).toMatchObject(mockMotiv);
  });
  it("GET /motivs/:motivId should return one motiv when one of them is found", async () => {
    const mockFirstMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c66",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User1_10042020.jpeg",
      text: "Circuit Breaker Day 1",
      likes: 20,
    };
    const { body } = await request(app)
      .get(`/motivs/${mockFirstMotiv.motivId}`)
      .expect(200);
    expect(body).toMatchObject(mockFirstMotiv);
  });
  it("GET /motivs/:motivId should return all motivs when there is no id", async () => {
    const mockFirstMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c66",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User1_10042020.jpeg",
      text: "Circuit Breaker Day 1",
      likes: 20,
    };
    const mockSecondMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c67",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User3_10042020.jpeg",
      text: "Circuit Breaker Day 3",
      likes: 200,
    };
    const { body } = await request(app).get(`/motivs`).expect(200);
    expect(body).toMatchObject([mockFirstMotiv, mockSecondMotiv]);
  });
  it("GET /motivs/:motivId should return an empty object if Id is provided but not found", async () => {
    const mockNewMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c68",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User3_10042020.jpeg",
      text: "Circuit Breaker Day 3",
      likes: 200,
    };
    const { body } = await request(app)
      .get(`/motivs/${mockNewMotiv.motivId}`)
      .expect(200);
    expect(body).toEqual({});
  });

  it("PATCH /motivs/:motivId/likes should change the number of likes of the corresponding motiv", async () => {
    const motivId = "42db221d-0ea0-405a-a5ab-a60ff8cc4c66";
    const mockMotivUpdate = {
      userId: "80145006-0804-4316-a057-77a658cf14dc",
      likes: 21,
    };
    const { body } = await request(app)
      .patch(`/motivs/${motivId}/likes`)
      .set("Cookie", "token=valid-token")
      .send(mockMotivUpdate)
      .expect(200);
  });
  it("PATCH /motivs/:motivId/comments should add new comments to the existing comments array", async () => {
    const motivId = "42db221d-0ea0-405a-a5ab-a60ff8cc4c66";
    const mockMotivComments = {
      userId: "80145006-0804-4316-a057-77a658cf14dc",
      message: "HIHIHIHIHIHI",
    };

    const mockUpdatedMotiv = {
      motivId: "42db221d-0ea0-405a-a5ab-a60ff8cc4c66",
      imageURL:
        "https://cofitphotos.s3-ap-southeast-1.amazonaws.com/User1_10042020.jpeg",
      text: "Circuit Breaker Day 1",
      likes: 20,
      commentArray: [mockMotivComments],
    };
    const { body } = await request(app)
      .patch(`/motivs/${motivId}/comments`)
      .set("Cookie", "token=valid-token")
      .send(mockMotivComments)
      .expect(200);
    expect(body).toMatchObject(mockUpdatedMotiv);
  });
});
