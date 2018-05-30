import "reflect-metadata";

import { expect } from "chai";
import { Container } from "typedi";
import { getCustomRepository, QueryFailedError } from "typeorm";

import { Database } from "../database";
import { User } from "../entities";
import { UserRepository } from "./user.repository";

describe("unit test: user repository", async () => {
  const db = Container.get(Database);

  before(async () => {
    await db.connect();
    await db.reset();
  });

  after(async () => {
    db.disconnect();
  });

  it("should return empty list of users", async () => {
    const users = await getCustomRepository(UserRepository).getAllUsers();
    expect(users).that.eql([]);
  });

  it("should create user", async () => {
    const user = await getCustomRepository(UserRepository).createUser({
      username: "test",
      email: "test@mail.com",
      password: "test",
      roles: [{ id: 1, name: "user" }],
    });
    expect(user).to.have.property("username", "test");
    expect(user).to.have.property("email", "test@mail.com");
    expect(user).to.have.property("password", "test");
    expect(user.roles).to.deep.equals([{ id: 1, name: "user" }]);
  });

  it("should failed to create user", async () => {
    const user = new User();
    user.email = "test@mail.com";
    user.roles = [{ id: 1, name: "user" }];
    try {
      const save = await getCustomRepository(UserRepository).save(user);
    } catch (err) {
      expect(err.name).to.be.equal("QueryFailedError");
    }
  });

  it("should return list with 1 user", async () => {
    const users = await getCustomRepository(UserRepository).getAllUsers();
    expect(users).that.not.eql([]);
    const user = users![0];
    expect(user).to.have.property("username", "test");
    expect(user).to.have.property("email", "test@mail.com");
    expect(user).to.have.property("password", "test");
    expect(user.roles).to.deep.equals([{ id: 1, name: "user" }]);
  });

  it("should get user by username ", async () => {
    const user = await getCustomRepository(UserRepository).getUserByUsername(
      "test",
    );
    expect(user).to.have.property("username", "test");
  });
});
