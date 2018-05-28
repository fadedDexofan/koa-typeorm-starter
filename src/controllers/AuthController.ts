import * as bcrypt from "bcryptjs";
import { classToPlain } from "class-transformer";
import * as jwt from "jsonwebtoken";
import { Context } from "koa";
import {
  BadRequestError,
  Body,
  BodyParam,
  Ctx,
  Delete,
  Get,
  HttpError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  UnauthorizedError,
  UseBefore,
} from "routing-controllers";
import { getRepository, Repository } from "typeorm";
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

const UserRepository = getRepository(User);
const RefreshRepository = getRepository(RefreshToken);

@JsonController("/auth")
export class AuthController {
  constructor(
    private userRepository: Repository<User>,
    private refreshRepository: Repository<RefreshToken>,
  ) {
    this.userRepository = UserRepository;
    this.refreshRepository = RefreshRepository;
  }
  @Post("/register")
  public async register(@Ctx() ctx: Context, @Body() userData: User) {
    const { username, email, password } = userData;

    const dupUser = await this.userRepository.findOne({ username });
    if (dupUser) {
      return { message: "User already exists." };
    }
    const hashedPassword = await hashPassword(password);

    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.setPassword(hashedPassword);

    const createdUser: User = await this.userRepository.save(newUser);
    delete createdUser.password;
    return createdUser;
  }

  @Post("/login")
  public async login(@Ctx() ctx: Context, @Body() loginData: User) {
    const { username, password } = loginData;

    const user = await this.userRepository.findOne(
      { username },
      { relations: ["refreshTokens"] },
    );
    if (!user) {
      return new BadRequestError("User with this credentials not found");
    }
    const passwordIsCorrect = await user.checkPassword(password);
    if (!passwordIsCorrect) {
      return new UnauthorizedError("Wrong password");
    }

    const accessToken = await makeAccessToken(user, JWT_SECRET);
    const refreshToken = await makeRefreshToken(user, JWT_SECRET);

    const rToken = new RefreshToken();
    rToken.refreshToken = refreshToken;
    user.refreshTokens.push(rToken);
    await this.userRepository.save(user);

    return {
      accessToken: accessToken.token,
      refreshToken,
      expires_in: accessToken.exp,
    };
  }

  @Post("/refresh-tokens")
  public async refreshTokens(
    @Ctx() ctx: Context,
    @BodyParam("refreshToken") refreshToken: string,
  ) {
    const tokenData = jwt.decode(refreshToken);
    // @ts-ignore
    const expired = tokenData.exp < new Date().getTime() / 1000;
    // @ts-ignore
    const uuid = tokenData.sub;
    const tokenInDB = await this.refreshRepository.findOne({
      where: {
        user: uuid,
        refreshToken,
      },
      relations: ["user"],
    });
    if (!tokenInDB) {
      return new NotFoundError("Token not found");
    }
    try {
      const valid = await jwtService.verify(refreshToken, JWT_SECRET);
    } catch (err) {
      await this.refreshRepository.remove(tokenInDB);
      return new HttpError(403, "Invalid Refresh Token");
    }
    if (expired) {
      await this.refreshRepository.remove(tokenInDB);
    }
    const newAccessToken = await makeAccessToken(tokenInDB.user, JWT_SECRET);
    const newRefreshToken = await makeRefreshToken(tokenInDB.user, JWT_SECRET);

    const rToken = new RefreshToken();
    rToken.refreshToken = refreshToken;
    rToken.user = tokenInDB.user;
    await this.refreshRepository.save(rToken);

    return {
      accessToken: newAccessToken.token,
      refreshToken,
      expires_in: newAccessToken.exp,
    };
  }
}
