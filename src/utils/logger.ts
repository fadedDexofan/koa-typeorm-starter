import fs from "fs";
import { createLogger, format, transports } from "winston";

const { combine, colorize, timestamp, label, printf, prettyPrint } = format;

const logDir = "logs";

const DEBUG = process.env.NODE_ENV !== "production";

const logFormat = printf(
  (info) => `[${info.timestamp}] [${info.level}]: ${info.message}`,
);

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: DEBUG ? "debug" : "info",
  format: combine(timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

if (DEBUG) {
  logger.add(
    new transports.Console({
      format: combine(colorize(), timestamp(), logFormat),
    }),
  );
}

export default logger;
