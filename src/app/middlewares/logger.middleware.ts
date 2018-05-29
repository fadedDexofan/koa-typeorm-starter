import { Context } from "koa";
import { KoaMiddlewareInterface, Middleware } from "routing-controllers";
import { logger } from "../../utils";

@Middleware({ type: "before" })
export class LoggingMiddleware implements KoaMiddlewareInterface {
  public async use(
    ctx: Context,
    next: (err?: any) => Promise<any>,
  ): Promise<any> {
    const start = Date.now();
    return next()
      .then(() => {
        const elapsed = Math.ceil(Date.now() - start);
        logger.debug(`(${ctx.method}) ${ctx.url} - ${elapsed}ms`);
      })
      .catch((err) => {
        logger.error(`${err}`);
      });
  }
}
