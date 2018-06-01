import { BadRequestError } from "routing-controllers";

export class BadRefreshTokenError extends BadRequestError {
  constructor() {
    super("Bad Refresh Token format");
    this.name = "BadRefreshTokenError";
  }
}
