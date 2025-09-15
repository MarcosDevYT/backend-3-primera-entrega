import config from "../config/index.js";
import winston from "winston";

const { combine, timestamp, printf, colorize, errors, align } = winston.format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const transports: winston.transport[] = [];

// Console transport para dev
if (config.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      level: "silly",
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        align(),
        errors({ stack: true }),
        printf(({ timestamp, level, message, stack, ...meta }) => {
          const logMessage = stack || message;
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : "";
          return `${timestamp} [${level}]: ${logMessage}${metaStr}`;
        })
      ),
    })
  );
}

// File transport para producción (solo warn y error)
if (config.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "error.log",
      level: "warn", // guardará warn y error
      format: combine(
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errors({ stack: true }),
        printf(({ timestamp, level, message, stack, ...meta }) => {
          const logMessage = stack || message;
          const metaStr = Object.keys(meta).length
            ? `\n${JSON.stringify(meta, null, 2)}`
            : "";
          return `${timestamp} [${level}]: ${logMessage}${metaStr}`;
        })
      ),
    })
  );
}

// Logger global
const logger = winston.createLogger({
  levels,
  level:
    config.LOG_LEVEL || (config.NODE_ENV !== "production" ? "silly" : "warn"),
  transports,
  silent: config.NODE_ENV === "test",
});

export { logger };
