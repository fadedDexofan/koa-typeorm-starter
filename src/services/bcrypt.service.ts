import { compare, hash } from "bcryptjs";
import config from "config";
import { Service } from "typedi";

const SALT_ROUNDS: number = config.has("auth.saltRounds")
  ? config.get("auth.saltRounds")
  : 10;

@Service()
export class BcryptService {
  public async hashString(
    plainText: string,
    saltRounds: number = SALT_ROUNDS,
  ): Promise<string> {
    return hash(plainText, saltRounds);
  }

  public async compareHash(
    plainText: string,
    hashString: string,
  ): Promise<boolean> {
    return compare(plainText, hashString);
  }
}
