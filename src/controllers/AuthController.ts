import * as bcrypt from "bcryptjs";
import { classToPlain } from "class-transformer";
import * as jwt from "jsonwebtoken";
import Koa from "koa";
import { getRepository } from "typeorm";

import { errorCodes } from "../config/errorCodes";
import { RefreshToken } from "../db/entity/RefreshToken";
import { User } from "../db/entity/User";
import * as jwtService from "../services/jwtService";
import { makeAccessToken } from "../services/makeAccessTokenService";
import { makeRefreshToken } from "../services/makeRefreshTokenService";

const JWT_SECRET = process.env.JWT_SECRET || "changemeinenv";

async function hashPassword(password: string, saltRounds: number = 10) {
  return bcrypt.hash(password, saltRounds);
}

export const register = async (ctx: Koa.Context) => {
  const userRepo = getRepository(User);

  const { username, email, password } = ctx.request.body;
  const dupUser = await userRepo.findOne({ username });
  if (dupUser) {
    ctx.status = 403;
    ctx.body = { message: "User already exists." };
    return;
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User();
  newUser.username = username;
  newUser.email = email;
  newUser.setPassword(hashedPassword);

  const createdUser: User = await userRepo.save(newUser);
  ctx.body = classToPlain(createdUser);
};

export const login = async (ctx: Koa.Context) => {
  const userRepo = getRepository(User);

  const { username, password } = ctx.request.body;
  const user = await userRepo.findOne(
    { username },
    { relations: ["refreshTokens"] },
  );
  if (!user) {
    ctx.status = 404;
    ctx.body = errorCodes.NOT_FOUND;
    return;
  }
  const passwordIsCorrect = await user.checkPassword(password);
  if (!passwordIsCorrect) {
    ctx.status = 403;
    ctx.body = errorCodes.INVALID_PASSWORD;
    return;
  }

  const accessToken = await makeAccessToken(user, JWT_SECRET);
  const refreshToken = await makeRefreshToken(user, JWT_SECRET);

  const rToken = new RefreshToken();
  rToken.refreshToken = refreshToken;
  user.refreshTokens.push(rToken);
  await userRepo.save(user);

  ctx.body = {
    accessToken: accessToken.token,
    refreshToken,
    expires_in: accessToken.exp,
  };
};

export const refreshTokens = async (ctx: Koa.Context) => {
  const refreshRepo = getRepository(RefreshToken);

  const { refreshToken } = ctx.request.body;
  const tokenData = jwt.decode(refreshToken);
  // @ts-ignore
  const expired = tokenData.exp < new Date().getTime() / 1000;
  // @ts-ignore
  const uuid = tokenData.sub;
  const tokenInDB = await refreshRepo.findOne({
    where: {
      user: uuid,
      refreshToken,
    },
    relations: ["user"],
  });
  if (!tokenInDB) {
    ctx.status = errorCodes.NOT_FOUND.status;
    ctx.body = errorCodes.NOT_FOUND;
    return;
  }
  try {
    const valid = await jwtService.verify(refreshToken, JWT_SECRET);
  } catch (err) {
    await refreshRepo.remove(tokenInDB);
    ctx.body = err;
  }
  if (expired) {
    await refreshRepo.remove(tokenInDB);
  }
  const newAccessToken = await makeAccessToken(tokenInDB.user, JWT_SECRET);
  const newRefreshToken = await makeRefreshToken(tokenInDB.user, JWT_SECRET);

  const rToken = new RefreshToken();
  rToken.refreshToken = refreshToken;
  rToken.user = tokenInDB.user;
  await refreshRepo.save(rToken);

  ctx.body = {
    accessToken: newAccessToken.token,
    refreshToken,
    expires_in: newAccessToken.exp,
  };
};
