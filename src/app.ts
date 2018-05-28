import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { createKoaServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import { createConnection } from "typeorm";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

useContainer(Container);

createConnection()
  .then(async (connection) => {
    try {
      logger.info("DB connected, now running Koa");
      const app = createKoaServer({
        routePrefix: "/api",
        cors: true,
        controllers: [__dirname + "/controllers/**/*.js"],
      });
      app.listen(3000);
      logger.info(`Server started at http://localhost:${PORT}`);
    } catch (err) {
      logger.error(err);
    }
  })
  .catch((err) => logger.error(`TypeORM connection error: ${err}`));
