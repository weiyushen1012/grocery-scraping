import puppeteer, { Page, Browser } from "puppeteer";
import logger from "../../logging";
import path from "path";
import fs = require("fs");
import keywords from "./keywords";

const ADDRESS: string = "https://jet.com/";
const HIT_HTML_CLASS = "fSSCaC";
const OUT_OF_STOCK_HTML_CLASS = "eIFaPZ";

const directoryPath: string = path.resolve(
    __dirname,
    "../../..",
    "screenshots"
);

const scrapingKeyword = async (
    browser: Browser,
    keyword: string
): Promise<void> => {
    logger.info(`Searching: ${keyword}`);
    const page: Page = await browser.newPage();
    await page.setViewport({ height: 1000, width: 1000 });
    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );
    await page.goto(`${ADDRESS}search?term=${keyword}`);

    const hits = await page.$$(`.${HIT_HTML_CLASS}`);
    const outOfStock = await page.$$(`.${OUT_OF_STOCK_HTML_CLASS}`);

    const hitsNumber = hits ? hits.length : 0;
    const outOfStockNumber = outOfStock ? outOfStock.length : 0;

    if (hitsNumber > 0 && hitsNumber > outOfStockNumber) {
        const imageFileName: string = `${keyword.split(" ").join("_")}.jpeg`;
        logger.info(
            `Got ${
                hitsNumber - outOfStockNumber
            } hits, taking screenshot [${imageFileName}]`
        );

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        await page.screenshot({
            path: path.resolve(directoryPath, imageFileName),
        });
    } else {
        if (hitsNumber === 0) {
            logger.info(`No hit: bad searching phrase`);
        } else {
            logger.info(`No hit: out of stock`);
        }
    }
    await page.close();
};

const scraping = async (): Promise<void> => {
    for (let i = 0; i < keywords.length; i++) {
        const browser: Browser = await puppeteer.launch({
            headless: true,
        });

        await scrapingKeyword(browser, keywords[i]);
        await browser.close();
    }
};

export default scraping;
