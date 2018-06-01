import {
  EntityRepository,
  FindManyOptions,
  InsertResult,
  Repository,
} from "typeorm";
import { Role } from "../entities/role.entity";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  public async getRoleByName(name: string): Promise<Role | undefined> {
    return this.findOne({ where: { name } });
  }

  public async createRole(name: string): Promise<InsertResult | undefined> {
    return this.createQueryBuilder()
      .insert()
      .into("role", ["name"])
      .values({ name })
      .execute();
  }
}
