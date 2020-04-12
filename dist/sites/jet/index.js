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
const puppeteer_1 = __importDefault(require("puppeteer"));
const logging_1 = __importDefault(require("../../logging"));
const path_1 = __importDefault(require("path"));
const fs = require("fs");
const keywords_1 = __importDefault(require("./keywords"));
const ADDRESS = "https://jet.com/";
const HIT_HTML_CLASS = "fSSCaC";
const OUT_OF_STOCK_HTML_CLASS = "eIFaPZ";
const directoryPath = path_1.default.resolve(__dirname, "../../..", "screenshots");
const scrapingKeyword = (browser, keyword) => __awaiter(void 0, void 0, void 0, function* () {
    logging_1.default.info(`Searching: ${keyword}`);
    const page = yield browser.newPage();
    yield page.setViewport({ height: 1000, width: 1000 });
    yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36");
    yield page.goto(`${ADDRESS}search?term=${keyword}`);
    const hits = yield page.$$(`.${HIT_HTML_CLASS}`);
    const outOfStock = yield page.$$(`.${OUT_OF_STOCK_HTML_CLASS}`);
    const hitsNumber = hits ? hits.length : 0;
    const outOfStockNumber = outOfStock ? outOfStock.length : 0;
    if (hitsNumber > 0 && hitsNumber > outOfStockNumber) {
        const imageFileName = `${keyword.split(" ").join("_")}.jpeg`;
        logging_1.default.info(`Got ${hitsNumber - outOfStockNumber} hits, taking screenshot [${imageFileName}]`);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }
        yield page.screenshot({
            path: path_1.default.resolve(directoryPath, imageFileName),
        });
    }
    else {
        if (hitsNumber === 0) {
            logging_1.default.info(`No hit: bad searching phrase`);
        }
        else {
            logging_1.default.info(`No hit: out of stock`);
        }
    }
    yield page.close();
});
const scraping = () => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < keywords_1.default.length; i++) {
        const browser = yield puppeteer_1.default.launch({
            headless: true,
        });
        yield scrapingKeyword(browser, keywords_1.default[i]);
        yield browser.close();
    }
});
exports.default = scraping;
//# sourceMappingURL=index.js.map