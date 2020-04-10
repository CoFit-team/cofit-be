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
      "4": "POST /motivs",
      "5": "PATCH /motivs?id=motivId/likes",
      "6": "PATCH /motivs?id=motivId/comments",
      "7": "PATCH /users/userId",
    });
  });
});
