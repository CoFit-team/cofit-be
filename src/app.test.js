const app = require("./app");
const request = require("supertest");

describe("app", () => {
  it("GET / should return status 200", async () => {
    const { body } = await request(app).get("/").expect(200);
    expect(body).toEqual({
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
});
