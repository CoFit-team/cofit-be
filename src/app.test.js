const app = require("./app");
const request = require("supertest");

describe("app", () => {
  it("GET / should return status 200", async () => {
    const { body } = await request(app).get("/").expect(200);
    expect(body).toEqual({
      "0": "POST /users/newuser",
      "1": "POST /users/login",
      "2": "POST /users/logout",
      "3": "GET /motivs",
      "4": "GET /motivs/:motivId",
      "5": "POST /motivs",
      "6": "PATCH /motivs/:motivId/likes",
      "7": "PATCH /motivs/:motivId/comments",
      "8": "PATCH /users/userId",
    });
  });
});
