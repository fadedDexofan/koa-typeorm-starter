import { compare, hash } from "bcryptjs";
import { Service } from "typedi";

@Service()
export class BcryptService {
  public async hashString(
    plainText: string,
    saltRounds: number = 10,
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
