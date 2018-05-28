import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import Koa from "koa";
import { getRepository } from "typeorm";

import { classToPlain } from "class-transformer";
import { RefreshToken } from "../db/entity/RefreshToken";
import { User } from "../db/entity/User";
import * as jwtService from "../services/jwtService";

export const profile = async (ctx: Koa.Context) => {
  const userRepo = getRepository(User);

  const { username } = ctx.state.user;
  const user = await userRepo.findOne({ username });

  ctx.body = classToPlain(user);
};
