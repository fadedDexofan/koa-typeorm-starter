import "reflect-metadata";

import { expect } from "chai";
import { Container } from "typedi";
import { getCustomRepository, QueryFailedError } from "typeorm";

import { Database } from "../database";
import { User } from "../entities";
import { RoleRepository } from "./role.repository";

describe("unit test: role repository", async () => {
  const db = Container.get(Database);

  before(async () => {
    await db.connect();
    await db.reset();
  });

  after(async () => {
    db.disconnect();
  });

  it("should create new role", async () => {
    const newRole = await getCustomRepository(RoleRepository).createRole(
      "testrole",
    );
    expect(newRole);
  });

  it("should fail to create new role", async () => {
    try {
      const newRole = await getCustomRepository(RoleRepository).createRole(
        "testrole",
      );
    } catch (err) {
      expect(err.name).to.be.equal("QueryFailedError");
    }
  });

  it("should get role by name", async () => {
    const role = await getCustomRepository(RoleRepository).getRoleByName(
      "user",
    );
    expect(role).to.be.deep.equal({ id: 1, name: "user" });
  });

  it("should fail to get role by name", async () => {
    const role = await getCustomRepository(RoleRepository).getRoleByName(
      "role",
    );
    expect(role).to.be.an("undefined");
  });
});
