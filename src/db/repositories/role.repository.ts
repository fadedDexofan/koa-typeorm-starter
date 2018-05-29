import { Service } from "typedi";
import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { Role } from "../entities/role.entity";

@Service()
@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
  public async getRoleByName(name: string): Promise<Role | undefined> {
    return this.findOne({ where: { name } });
  }
}
