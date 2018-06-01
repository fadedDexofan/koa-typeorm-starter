import {
  DeleteResult,
  EntityRepository,
  FindManyOptions,
  Repository,
} from "typeorm";
import { RefreshToken, User } from "../entities";

@EntityRepository(RefreshToken)
export class RefreshRepository extends Repository<RefreshToken> {
  public async dropUserTokens(user: User): Promise<RefreshToken[] | undefined> {
    return this.remove(user.refreshTokens!);
  }
}
