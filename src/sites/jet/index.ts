import { Page, Browser } from "puppeteer";
import logger from "../../logging";
import path from "path";
import fs = require("fs");
import keywords from "./keywords";

const ADDRESS: string = "https://jet.com/";
const HIT_HTML_CLASS = "fSSCaC";
const OUT_OF_STOCK_HTML_CLASS = "eIFaPZ";

const scraping = async (browser: Browser): Promise<void> => {
    const page: Page = await browser.newPage();

    for (let i = 0; i < keywords.length; i++) {
        await page.goto(`${ADDRESS}search?term=${keywords[i]}`);
        const keyword = keywords[i];

        logger.info(`Searching: ${keyword}`);

        const hits = await page.$$(`.${HIT_HTML_CLASS}`);
        const outOfStock = await page.$$(`.${OUT_OF_STOCK_HTML_CLASS}`);

        const hitsNumber = hits ? hits.length : 0;
        const outOfStockNumber = outOfStock ? outOfStock.length : 0;

        if (hitsNumber > 0 && hitsNumber > outOfStockNumber) {
            const imageFileName: string = `${keyword
                .split(" ")
                .join("_")}.jpeg`;
            logger.info(
                `Got ${
                    hitsNumber - outOfStockNumber
                } hits, taking screenshot [${imageFileName}]`
            );

            const directoryPath: string = path.resolve(
                __dirname,
                "../../..",
                "screenshots"
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
    }

    //await page.close();
};

export default scraping;
