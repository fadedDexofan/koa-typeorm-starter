import * as bcrypt from "bcryptjs";
import { classToPlain } from "class-transformer";
import { Context } from "koa";
import {
  Authorized,
  Body,
  Ctx,
  CurrentUser,
  Delete,
  Get,
  JsonController,
  NotFoundError,
  OnUndefined,
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { InjectRepository } from "typeorm-typedi-extensions";
import { RefreshToken, User } from "../../../db/entities";
import { RefreshRepository, UserRepository } from "../../../db/repositories";
import { JWTService } from "../../../services/jwt.service";
import { UserNotFoundError } from "../../errors";
import { authorizationChecker } from "../../middlewares";

@JsonController("/users")
export class UserController {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    @InjectRepository() private refreshRepository: RefreshRepository,
    private jwtService: JWTService,
  ) {}
  @Authorized(["user"])
  @Get("/profile/current")
  public async profile(@Ctx() ctx: Context, @CurrentUser() user: User) {
    if (!user) {
      return new NotFoundError("User not found");
    }
    return user;
  }
  @Authorized(["user"])
  @Get("/:uuid")
  @OnUndefined(UserNotFoundError)
  public async getUser(@Param("uuid") uuid: string) {
    return this.userRepository.getUserByUuid(uuid);
  }
}