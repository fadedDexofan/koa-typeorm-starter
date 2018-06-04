import { Context } from "koa";
import {
  Authorized,
  Ctx,
  CurrentUser,
  Get,
  JsonController,
  NotFoundError,
  OnUndefined,
  Param,
} from "routing-controllers";
import { InjectRepository } from "typeorm-typedi-extensions";
import { User } from "../../../db/entities";
import { RefreshRepository, UserRepository } from "../../../db/repositories";
import { JWTService } from "../../../services/jwt.service";
import { UserNotFoundError } from "../../errors";

@JsonController("/users")
export class UserController {
  constructor(
    @InjectRepository() private userRepository: UserRepository,
    // tslint:disable-next-line
    @InjectRepository() private refreshRepository: RefreshRepository,
    // tslint:disable-next-line
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
