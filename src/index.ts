import logger from "./logging";
import puppeteer, { Browser, Page } from "puppeteer";
import jet from "./sites/jet";
import { sendResult } from "./email";
import dotenv from "dotenv";

dotenv.config();

const HEADLESS: boolean = true;

const main = async (): Promise<void> => {
    logger.info("----BEGIN----");

    logger.info("Creating headless browser");
    const browser: Browser = await puppeteer.launch({ headless: HEADLESS });

    logger.info("Scraping Jet");
    await jet(browser);

    await browser.close();

    await sendResult();
    logger.info("----END----");
};

main();
