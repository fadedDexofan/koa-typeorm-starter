import { Context } from "koa";
import { Container } from "typedi";
import { getCustomRepository } from "typeorm";

import { User } from "../../db/entities";
import { UserRepository } from "../../db/repositories";
import { JWTService } from "../../services";
import { extractToken } from "../../utils";

const jwtService = Container.get(JWTService);

export async function currentUserChecker(
  ctx: Context,
): Promise<User | undefined> {
  const token = extractToken(ctx.request.headers);
  const payload: any = await jwtService.verify(token);
  return getCustomRepository(UserRepository).getUserByUuid(payload.sub);
}
