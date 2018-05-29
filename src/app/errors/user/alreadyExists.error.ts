import { BadRequestError } from "routing-controllers";

export class UserAlreadyExistsError extends BadRequestError {
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExistsError";
  }
}
