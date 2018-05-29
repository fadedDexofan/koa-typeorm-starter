import config from "config";
import { decode, sign, verify } from "jsonwebtoken";
import { Service } from "typedi";
import { User } from "../db/entities";

const JWT_SECRET: string = config.has("auth.jwtSecret")
  ? config.get("auth.jwtSecret")
  : "changeinconfig";

@Service()
export class JWTService {
  public async sign(payload: any, options: any) {
    return sign(payload, JWT_SECRET, options);
  }
  public async verify(token: string) {
    return verify(token, JWT_SECRET);
  }

  public async makeAccessToken(user: User) {
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
    const token = await this.sign(configAccess.payload, configAccess.options);
    const tokenData = decode(token);
    // @ts-ignore
    const exp = tokenData.exp;
    return { token, exp };
  }

  public async makeRefreshToken(user: User) {
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
      configRefresh.options,
    );
    return refreshToken;
  }
}
