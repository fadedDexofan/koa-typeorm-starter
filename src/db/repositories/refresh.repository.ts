import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { RefreshToken } from "../entity";

@EntityRepository(RefreshToken)
export class RefreshRepository extends Repository<RefreshToken> {}
