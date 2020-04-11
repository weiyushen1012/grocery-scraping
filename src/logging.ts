import winston, { format } from "winston";
import _ from "lodash";

const myFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${_.toUpper(level)}]: ${message}`;
});

const logger = winston.createLogger({
    format: format.combine(format.timestamp(), myFormat),
    transports: [new winston.transports.Console()],
});

export default logger;
