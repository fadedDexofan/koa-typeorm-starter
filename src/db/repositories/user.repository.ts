import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { User } from "../entities";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async getUserById(id: string): Promise<User | undefined> {
    return this.findOne(id);
  }

  public async getUserByUsername(username: string): Promise<User | undefined> {
    return this.findOne({ username });
  }
  public async createUser(user: User): Promise<User> {
    return this.save(user);
  }
}
