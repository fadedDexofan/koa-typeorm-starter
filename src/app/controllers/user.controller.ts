import * as bcrypt from "bcryptjs";
import { classToPlain } from "class-transformer";
import { Context } from "koa";
import {
  Body,
  Ctx,
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
import { User } from "../../db/entity";
import { RefreshToken } from "../../db/entity/RefreshToken";
import { RefreshRepository, UserRepository } from "../../db/repositories";
import jwt from "../../middlewares/jwt";
import * as jwtService from "../../services/jwtService";
@JsonController("/users")
@UseBefore(jwt)
export class UserController {
  constructor(
    @OrmRepository() private userRepository: UserRepository,
    @OrmRepository() private refreshRepository: RefreshRepository,
  ) {}
  @Get("/me")
  public async profile(@Ctx() ctx: Context) {
    const { username } = ctx.state.user;
    const user = await this.userRepository.getUserByUsername(username);
    if (!user) {
      return new NotFoundError("User not found");
    }
    delete user.password;
    return user;
  }
}
