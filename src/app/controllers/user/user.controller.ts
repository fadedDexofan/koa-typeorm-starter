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
  Param,
  Post,
  Put,
  UseBefore,
} from "routing-controllers";
import { OrmRepository } from "typeorm-typedi-extensions";
import { RefreshToken, User } from "../../../db/entities";
import { RefreshRepository, UserRepository } from "../../../db/repositories";
import { JWTService } from "../../../services/jwt.service";
import { authorizationChecker } from "../../middlewares/authorizationChecker.middleware";

@JsonController("/users")
export class UserController {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @OrmRepository() private refreshRepository: RefreshRepository,
    private jwtService: JWTService,
  ) {}
  @Authorized(["user"])
  @Get("/me")
  public async profile(@Ctx() ctx: Context, @CurrentUser() user: User) {
    if (!user) {
      return new NotFoundError("User not found");
    }
    delete user.password;
    return user;
  }
}
