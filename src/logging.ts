import winston, { format } from "winston";

const myFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]  ${message}`;
});

const logger = winston.createLogger({
    format: format.combine(format.timestamp(), myFormat),
    transports: [new winston.transports.Console()],
});

export default logger;
