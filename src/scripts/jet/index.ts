import { Page, Browser } from "puppeteer";
import logger from "../../logging";
import path from "path";
import fs = require("fs");

const ADDRESS: string = "https://jet.com/";
const SEARCH_BAR_HTML_ID = "MobileSearchBarInput";

const keywords: string[] = ["clorox toilet wand refills"];

const scrapingKeyword = async (page: Page, keyword: string): Promise<void> => {
    logger.info(`Searching: ${keyword}`);
    await page.keyboard.type(keyword);

    await page.keyboard.press("Enter");

    await page.waitForNavigation();

    const hits = await page.$$(".fSSCaC");

    if (hits && hits.length > 0) {
        const imageFileName: string = `${keyword.split(" ").join("_")}.jpeg`;
        logger.info(
            `Got ${hits.length} hits, taking screenshot ${imageFileName}`
        );

        const directoryPath: string = path.resolve(__dirname, "screenshots");

        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath);
        }

        await page.screenshot({
            path: path.resolve(directoryPath, imageFileName),
        });
    } else {
        logger.info(`No hit`);
    }
};

const scraping = async (browser: Browser): Promise<void> => {
    const page: Page = await browser.newPage();
    await page.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
    );

    page.setViewport({ height: 1000, width: 1000 });

    logger.info(`Loading address ${ADDRESS}`);
    await page.goto(ADDRESS);

    logger.info(`Clicking search bar with id ${SEARCH_BAR_HTML_ID}`);
    await page.click(`#${SEARCH_BAR_HTML_ID}`);

    logger.info(`Searching for all keywords`);

    const promises: Promise<void>[] = [];
    keywords.forEach(
        async (keyword: string): Promise<void> => {
            promises.push(scrapingKeyword(page, keyword));
        }
    );

    await Promise.all(promises);

    logger.info(`Closing page for Jet`);
    await page.close();
};

export default scraping;
