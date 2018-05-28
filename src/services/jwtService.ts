import * as jwt from "jsonwebtoken";

import { errorCodes } from "../config/errorCodes";
import { ErrorWrapper } from "../utils/ErrorWrapper";

export const verify = async (token: string, SECRET: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return reject(new ErrorWrapper({ ...errorCodes.TOKEN_EXPIRED }));
        }
        return reject(new Error("jwt error"));
      }
      return resolve(decoded);
    });
  });
};

export const sign = async (
  payload: object,
  SECRET: string,
  options: object,
): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, SECRET, options, (err, token) => {
      if (err) {
        return reject(new ErrorWrapper({ ...errorCodes.TOKEN_NOT_SIGNED }));
      }
      return resolve(token);
    });
  });
};
