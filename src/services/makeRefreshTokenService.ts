import { User } from "../db/entity/User";
import * as jwtService from "./jwtService";
export const makeRefreshToken = async (user: User, SECRET: string) => {
  const configRefresh = {
    payload: {
      refreshToken: true,
      username: user.username,
    },
    options: {
      algorithm: "HS512",
      subject: user.uuid,
      expiresIn: "60d",
    },
  };
  const refreshToken = await jwtService.sign(
    configRefresh.payload,
    SECRET,
    configRefresh.options,
  );
  return refreshToken;
};
