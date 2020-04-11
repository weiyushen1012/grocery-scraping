import logger from "./logging";
import puppeteer from "puppeteer";

const main = async (): Promise<void> => {
    logger.info("Start Scraping...");
    const browser = await puppeteer.launch();

    browser.close();
};

main();
