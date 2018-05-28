import { createConnection } from "typeorm";

import app from "./app";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3000;

createConnection()
  .then(async (connection) => {
    try {
      app.listen(PORT);
      logger.info(`Server started at http://localhost:${PORT}`);
    } catch (err) {
      logger.error(err);
    }
  })
  .catch((err) => logger.error(`TypeORM connection error: ${err}`));
