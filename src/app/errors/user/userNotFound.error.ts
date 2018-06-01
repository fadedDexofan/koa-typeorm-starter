import { NotFoundError } from "routing-controllers";

export class UserNotFoundError extends NotFoundError {
  constructor(message: string = "User not found") {
    super(message);
    this.name = "UserNotFoundError";
  }
}
