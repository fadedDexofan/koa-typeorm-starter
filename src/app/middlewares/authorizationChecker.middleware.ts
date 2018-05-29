import { Context } from "koa";
import { Action, HttpError } from "routing-controllers";
import { Container, Service } from "typedi";
import { getCustomRepository } from "typeorm";
import { OrmRepository } from "typeorm-typedi-extensions";

import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Role } from "../../db/entities";
import { UserRepository } from "../../db/repositories";
import { JWTService } from "../../services";
import { extractToken } from "../../utils";

const jwtService = Container.get(JWTService);

export async function authorizationChecker(
  ctx: Context,
  roles: string[],
): Promise<boolean> {
  const token = extractToken(ctx.request.headers);
  const payload: any = await jwtService.verify(token);
  if (!payload) {
    return false;
  }
  const userFromToken = await getCustomRepository(UserRepository).getUserByUuid(
    payload.sub,
  );
  if (!userFromToken) {
    return false;
  }
  if (roles && roles.length) {
    const userRoles = userFromToken.roles.map((role) => role.name);
    const isAuthorized = roles.every((role: string) =>
      userRoles.includes(role),
    );
    if (!isAuthorized) {
      return false;
    }
  }
  return true;
}
