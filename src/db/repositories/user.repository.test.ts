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
    const user = await getCustomRepository(UserRepository).save({
      username: "testuser",
      email: "testuser@mail.com",
      password: "12345678",
      roles: [{ id: 1, name: "user" }],
    });
    expect(user).to.have.property("username", "testuser");
    expect(user).to.have.property("email", "testuser@mail.com");
    expect(user.roles).to.deep.equals([{ id: 1, name: "user" }]);
  });

  it("should failed to create user", async () => {
    const user = new User();
    user.email = "testuser@mail.com";
    user.roles = [{ id: 1, name: "user" }];
    user.password = "123456780";
    try {
      const save = await getCustomRepository(UserRepository).save(user);
    } catch (err) {
      console.log(err);
      expect(err.name).to.be.equal("QueryFailedError");
    }
  });

  it("should return list with 1 user", async () => {
    const users = await getCustomRepository(UserRepository).getAllUsers();
    expect(users).that.not.eql([]);
    const user = users![0];
    expect(user).to.have.property("username", "testuser");
    expect(user).to.have.property("email", "testuser@mail.com");
    expect(user.roles).to.deep.equals([{ id: 1, name: "user" }]);
  });

  it("should get user by username", async () => {
    const user = await getCustomRepository(UserRepository).getUserByUsername(
      "testname",
    );
    expect(user).to.have.property("username", "testuser");
  });
});
