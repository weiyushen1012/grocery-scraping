import logger from "./logging";
import puppeteer, { Browser, Page } from "puppeteer";
import jet from "./scripts/jet";

const HEADLESS: boolean = true;

const main = async (): Promise<void> => {
    logger.info("********************");
    logger.info("Start scraping");

    logger.info("Creating headless browser");
    const browser: Browser = await puppeteer.launch({ headless: HEADLESS });

    browser.on("targetdestroyed", async () => {
        const pages: Page[] = await browser.pages();

        if (pages.length <= 1 && browser.isConnected()) {
            logger.info("Terminating headless browser");
            logger.info("********************");
            browser.close();
        }
    });

    logger.info("Scraping Jet");
    await jet(browser);
};

main();
