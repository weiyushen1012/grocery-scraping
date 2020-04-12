import { Page, Browser } from "puppeteer";
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

const scraping = async (browser: Browser): Promise<void> => {
    const page: Page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    );

    for (let i = 0; i < keywords.length; i++) {
        await page.goto(`${ADDRESS}search?term=${keywords[i]}`);
        const keyword = keywords[i];

        await page.screenshot({
            path: path.resolve(directoryPath, `${i}.jpeg`),
        });

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

    await page.close();
};

export default scraping;
