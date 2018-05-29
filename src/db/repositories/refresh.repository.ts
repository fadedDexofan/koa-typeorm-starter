import { Service } from "typedi";
import { EntityRepository, FindManyOptions, Repository } from "typeorm";
import { RefreshToken } from "../entities";

@Service()
@EntityRepository(RefreshToken)
export class RefreshRepository extends Repository<RefreshToken> {}
