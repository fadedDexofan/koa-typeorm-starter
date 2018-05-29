import supertest from "supertest";

import { expect, should } from "chai";
import { Container } from "typedi";

import { Database } from "../../../db/database";
import { App } from "../../app";

describe("e2e test: AuthController", async () => {
  const app = Container.get(App).getApp();
  const db = Container.get(Database);

  const server = supertest(app.listen());

  before(async () => {
    // FIXME: WRITE FUCKING MIGRATIONS
    await db.connect();
    await db.reset();
    await db.disconnect();
    await db.connect();
  });
  after(async () => {
    await db.disconnect();
  });

  describe("Auth", async () => {
    let refreshToken: string;
    before(async () => {
      await db.executeSQL("INSERT INTO role VALUES (DEFAULT, 'user')");
    });

    it("should register user", async () => {
      const response = await server.post("/api/auth/register").send({
        username: "test",
        email: "test@mail.com",
        password: "test",
      });
      expect(response.status).equals(201);
      expect(response.body).to.have.property("uuid");
      expect(response.body).to.have.property("username", "test");
      expect(response.body).to.have.property("email", "test@mail.com");
      expect(response.body).to.have.property("roles");
      expect(response.body.roles).to.deep.equal([{ id: 1, name: "user" }]);
    });

    it("should return user duplication error", async () => {
      const response = await server.post("/api/auth/register").send({
        username: "test",
        email: "test@mail.com",
        password: "test",
      });
      expect(response.status).equals(400);
      expect(response.body).to.have.property("name", "UserAlreadyExistsError");
    });

    it("should login user", async () => {
      const response = await server.post("/api/auth/login").send({
        username: "test",
        password: "test",
      });
      expect(response.body).to.have.property("accessToken");
      expect(response.body).to.have.property("refreshToken");
      refreshToken = response.body.refreshToken;
      expect(response.body).to.have.property("expires_in");
    });

    it("should return wrong password error", async () => {
      const response = await server.post("/api/auth/login").send({
        username: "test",
        password: "wrong",
      });
      expect(response.status).equals(403);
      expect(response.body).to.have.property("name", "WrongPasswordError");
    });

    it("should refresh token", async () => {
      const response = await server.post("/api/auth/refresh-tokens").send({
        refreshToken,
      });
      expect(response.body).to.have.property("accessToken");
      expect(response.body).to.have.property("refreshToken");
      expect(response.body).to.have.property("expires_in");
    });

    it("should return bad refresh token error", async () => {
      const response = await server.post("/api/auth/refresh-tokens").send({
        refreshToken: "badToken",
      });
      expect(response.status).equals(400);
      expect(response.body).to.have.property("name", "BadRefreshTokenError");
    });
  });
});
