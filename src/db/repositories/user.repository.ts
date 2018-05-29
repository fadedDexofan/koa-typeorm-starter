import { Service } from "typedi";
import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { User } from "../entities";

@Service()
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getUserByUuid(uuid: string): Promise<User | undefined> {
    return this.findOne(uuid, { relations: ["roles"] });
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
}
