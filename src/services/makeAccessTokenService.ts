import * as jwt from "jsonwebtoken";
import { User } from "../db/entity/User";
import * as jwtService from "./jwtService";
export const makeAccessToken = async (user: User, SECRET: string) => {
  const configAccess = {
    payload: {
      accessToken: true,
      username: user.username,
    },
    options: {
      algorithm: "HS512",
      subject: user.uuid,
      expiresIn: "30m",
    },
  };
  const token = await jwtService.sign(
    configAccess.payload,
    SECRET,
    configAccess.options,
  );
  const tokenData = jwt.decode(token);
  // @ts-ignore
  const exp = tokenData.exp;
  return { token, exp };
};
