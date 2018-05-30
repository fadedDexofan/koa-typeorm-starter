import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { User } from "../entities";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getUserByUuid(uuid: string): Promise<User | undefined> {
    return this.findOne(uuid, { relations: ["roles"] });
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }

  public async getAllUsers(): Promise<User[] | undefined> {
    return this.find({ relations: ["roles"] });
  }

  public async createUser(user: User): Promise<User> {
    return this.save(user);
  }
}
