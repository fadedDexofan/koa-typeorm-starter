import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { RefreshToken } from "../entities";

@EntityRepository(RefreshToken)
export class RefreshRepository extends Repository<RefreshToken> {}
