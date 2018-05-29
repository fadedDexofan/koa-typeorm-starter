/**
 * Util function to extract bearer token from headers
 * @param headers Koa request headers
 * @returns JWT Token
 */
export function extractToken(headers: any) {
  let token: string =
    headers && headers.authorization ? headers.authorization : "";
  token = token.replace(/Bearer\s+/gm, "");
  return token;
}
