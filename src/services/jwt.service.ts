import { decode, sign, verify } from "jsonwebtoken";
import { Service } from "typedi";
import { User } from "../db/entities";

@Service()
export class JWTService {
  public async sign(payload: any, SECRET: string, options: any) {
    return sign(payload, SECRET, options);
  }
  public async verify(token: string, SECRET: string) {
    return verify(token, SECRET);
  }

  public async makeAccessToken(user: User, SECRET: string) {
    const configAccess = {
      payload: {
        accessToken: true,
        username: user.username,
        roles: user.roles,
      },
      options: {
        algorithm: "HS512",
        subject: user.uuid,
        expiresIn: "30m",
      },
    };
    const token = await this.sign(
      configAccess.payload,
      SECRET,
      configAccess.options,
    );
    const tokenData = decode(token);
    // @ts-ignore
    const exp = tokenData.exp;
    return { token, exp };
  }

  public async makeRefreshToken(user: User, SECRET: string) {
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
    const refreshToken = await this.sign(
      configRefresh.payload,
      SECRET,
      configRefresh.options,
    );
    return refreshToken;
  }
}
