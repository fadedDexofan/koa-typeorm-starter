import { ForbiddenError } from "routing-controllers";

export class WrongPasswordError extends ForbiddenError {
  constructor() {
    super("Password mismatch");
    this.name = "WrongPasswordError";
  }
}
