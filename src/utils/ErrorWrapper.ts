interface IOptions {
  message: string;
  status: number;
  code: string;
}

export class ErrorWrapper extends Error {
  public status: number;
  public code: string;
  constructor(options: IOptions) {
    if (!options || !options.message) {
      throw new Error("message param required");
    }
    super();
    this.message = options.message;
    this.status = options.status || 500;
    this.code = options.code || "SERVER_ERROR";
  }
}
