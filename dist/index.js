"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = __importDefault(require("./logging"));
const jet_1 = __importDefault(require("./sites/jet"));
const email_1 = require("./email");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info("----BEGIN----");
    const screenshotsDir = path_1.default.resolve(__dirname, "..", "screenshots");
    if (fs_1.default.existsSync(screenshotsDir)) {
        logging_1.default.warn("Removing previous screenshots");
        const files = fs_1.default.readdirSync(screenshotsDir);
        for (let i = 0; i < files.length; i++) {
            fs_1.default.unlinkSync(path_1.default.resolve(__dirname, "..", "screenshots", files[i]));
        }
    }
    logging_1.default.info("Scraping Jet");
    yield jet_1.default();
    yield email_1.sendResult();
    logging_1.default.info("----END----");
});
const runType = process.argv[2];
if (!runType || runType === "immediately" || runType === "i") {
    main();
}
else if (runType === "scheduled" || runType === "s") {
    const minute = process.argv[3];
    const hour = process.argv[4];
    const cron = `${minute || 0} ${hour || 0} * * *`;
    logging_1.default.info(`Scheduled task with cron ${cron}`);
    node_schedule_1.default.scheduleJob(cron, () => {
        main();
    });
}
else {
    logging_1.default.error("Unknown run type");
}
//# sourceMappingURL=index.js.map