import { Context } from "koa";
import { Action, HttpError } from "routing-controllers";
import { Container, Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { UserRepository } from "../../db/repositories";
import { JWTService } from "../../services";

const jwtService = Container.get(JWTService);

const JWT_SECRET: string = process.env.JWT_SECRET || "changemeinenv";

export async function authorizationChecker(
  ctx: Context,
  roles: string[],
): Promise<boolean> {
  const headers = ctx.request.headers;
  let token: string =
    headers && headers.authorization ? headers.authorization : "";
  token = token.replace(/Bearer\s+/gm, "");
  const payload: any = await jwtService.verify(token, JWT_SECRET);
  if (!payload) {
    return false;
  }
  if (roles && roles.length) {
    const isAuthorized = payload.roles.find(
      (role: any) => roles.indexOf(role.name) > -1,
    )
      ? true
      : false;
    if (!isAuthorized) {
      return false;
    }
  }
  return true;
}
