import dotenv from "dotenv";
dotenv.config();

import { Container } from "typedi";
import { App } from "./app/app";
import { Database } from "./db/database";

import { logger } from "./utils";

const PORT = process.env.PORT || 3000;

const app = Container.get(App).getApp();
const database = Container.get(Database);

database.connect().then(async () => {
  app.listen(PORT, () => {
    logger.info(`Server started at http://localhost:${PORT}`);
  });
});
