import { BadRequestError } from "routing-controllers";

export class UserAlreadyExistsError extends BadRequestError {
  constructor(message: string = "User already exists") {
    super(message);
    this.name = "UserAlreadyExistsError";
  }
}
