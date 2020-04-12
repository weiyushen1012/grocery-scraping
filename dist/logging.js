"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importStar(require("winston"));
const lodash_1 = __importDefault(require("lodash"));
const myFormat = winston_1.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${lodash_1.default.toUpper(level)}]: ${message}`;
});
const logger = winston_1.default.createLogger({
    format: winston_1.format.combine(winston_1.format.timestamp(), myFormat),
    transports: [new winston_1.default.transports.Console()],
});
exports.default = logger;
//# sourceMappingURL=logging.js.map