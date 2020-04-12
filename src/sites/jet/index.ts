import { Page, Browser } from "puppeteer";
import logger from "../../logging";
import path from "path";
import fs = require("fs");
import keywords from "./keywords";

const ADDRESS: string = "https://jet.com/";
const SEARCH_BAR_HTML_ID = "MobileSearchBarInput";
const HIT_HTML_CLASS = "fSSCaC";
const OUT_OF_STOCK_HTML_CLASS = "eIFaPZ";

const directoryPath: string = path.resolve(
    __dirname,
    "../../..",
    "screenshots"
);

const scrapingKeyword = async (page: Page, keyword: string): Promise<void> => {
    logger.info(`Searching: ${keyword}`);
    await page.keyboard.type(keyword);

    await page.click(`#${SEARCH_BAR_HTML_ID}`);
    await page.keyboard.press("Enter");
    // await page.waitForNavigation();

    await page.screenshot({
        path: path.resolve(directoryPath, "test.png"),
    });

    await page.waitFor(3000);

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
};

const scraping = async (browser: Browser): Promise<void> => {
    const page: Page = await browser.newPage();
    await page.setViewport({ height: 1000, width: 1000 });
    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );

    await page.goto(ADDRESS);

    for (let i = 0; i < keywords.length; i++) {
        await page.click(`#${SEARCH_BAR_HTML_ID}`);

        if (i > 0) {
            for (let j = 0; j < keywords[i - 1].length; j++) {
                await page.keyboard.press("Backspace");
            }
        }

        await scrapingKeyword(page, keywords[i]);
    }

    await page.close();
};

export default scraping;
