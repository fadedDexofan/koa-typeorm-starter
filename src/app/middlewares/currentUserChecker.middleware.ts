import { Context } from "koa";
import { Action, HttpError } from "routing-controllers";
import { Container, Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { User } from "../../db/entities";
import { UserRepository } from "../../db/repositories";
import { JWTService } from "../../services";

const jwtService = Container.get(JWTService);

const JWT_SECRET: string = process.env.JWT_SECRET || "changemeinenv";

export async function currentUserChecker(
  ctx: Context,
): Promise<User | undefined> {
  const headers = ctx.request.headers;
  let token: string =
    headers && headers.authorization ? headers.authorization : "";
  token = token.replace(/Bearer\s+/gm, "");
  const payload: any = await jwtService.verify(token, JWT_SECRET);
  return getCustomRepository(UserRepository).findOne(payload.sub);
}
