import winston from "winston";

interface LogInfo {
  level: string;
  message: string;
  timestamp?: string;
  stack?: string;
}

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, stack }: LogInfo) => {
      return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

logger.info("Logging setup complete");
