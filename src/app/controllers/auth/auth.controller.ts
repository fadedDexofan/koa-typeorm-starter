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
  HttpCode,
  HttpError,
  JsonController,
  NotFoundError,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { InjectRepository } from "typeorm-typedi-extensions";

import { RefreshToken, User } from "../../../db/entities";
import {
  RefreshRepository,
  RoleRepository,
  UserRepository,
} from "../../../db/repositories";
import { BcryptService, JWTService } from "../../../services";
import {
  BadRefreshTokenError,
  UserAlreadyExistsError,
  WrongPasswordError,
} from "../../errors";

@JsonController("/auth")
export class AuthController {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @InjectRepository() private refreshRepository: RefreshRepository,
    @InjectRepository() private roleRepository: RoleRepository,
    private bcryptService: BcryptService,
    private jwtService: JWTService,
  ) {}

  @HttpCode(201)
  @Post("/register")
  public async register(@Ctx() ctx: Context, @Body() userData: User) {
    const { username, email, password } = userData;

    const dupUser = await this.userRepository.getUserByUsername(username);
    if (dupUser) {
      throw new UserAlreadyExistsError();
    }

    const role = await this.roleRepository.getRoleByName("user");
    if (!role) {
      throw new Error(
        `Cannot create user, cannot get role: ${userData.roles[0].name}`,
      );
    }

    const hashedPassword = await this.bcryptService.hashString(password);

    const newUser = new User(username, email, [role]);

    newUser.username = username;
    newUser.email = email;
    newUser.password = hashedPassword;

    const createdUser: User = await this.userRepository.save(newUser);
    delete createdUser.password;

    return createdUser;
  }

  @Post("/login")
  public async login(@Ctx() ctx: Context, @Body() loginData: User) {
    const { username, password } = loginData;

    const user = await this.userRepository.findOne(
      { username },
      { relations: ["refreshTokens", "roles"] },
    );
    if (!user) {
      throw new BadRequestError("User with this credentials not found");
    }

    const passwordIsCorrect = await this.bcryptService.compareHash(
      password,
      user.password,
    );
    if (!passwordIsCorrect) {
      throw new WrongPasswordError();
    }

    const accessToken = await this.jwtService.makeAccessToken(user);
    const refreshToken = await this.jwtService.makeRefreshToken(user);

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
    if (!tokenData) {
      throw new BadRefreshTokenError();
    }
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
      throw new NotFoundError("Token not found");
    }
    try {
      const valid = await this.jwtService.verify(refreshToken);
    } catch (err) {
      await this.refreshRepository.remove(tokenInDB);
      throw new HttpError(403, "Invalid Refresh Token");
    }
    if (expired) {
      await this.refreshRepository.remove(tokenInDB);
    }
    const newAccessToken = await this.jwtService.makeAccessToken(
      tokenInDB.user,
    );
    const newRefreshToken = await this.jwtService.makeRefreshToken(
      tokenInDB.user,
    );

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
