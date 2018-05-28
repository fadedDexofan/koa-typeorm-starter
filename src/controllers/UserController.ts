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
import { getRepository, Repository } from "typeorm";
import { RefreshToken } from "../db/entity/RefreshToken";
import { User } from "../db/entity/User";
import jwt from "../middlewares/jwt";
import * as jwtService from "../services/jwtService";

const UserRepository = getRepository(User);
const RefreshRepository = getRepository(RefreshToken);

@JsonController("/users")
@UseBefore(jwt)
export class UserController {
  constructor(
    private userRepository: Repository<User>,
    private refreshRepository: Repository<RefreshToken>,
  ) {
    this.userRepository = UserRepository;
    this.refreshRepository = RefreshRepository;
  }
  @Get("/me")
  public async profile(@Ctx() ctx: Context) {
    const { username } = ctx.state.user;
    const user = await this.userRepository.findOne({ username });
    if (!user) {
      return new NotFoundError("User not found");
    }
    delete user.password;
    return user;
  }
}
