import logger from "./logging";
import puppeteer, { Browser, Page } from "puppeteer";

const address: string = "https://jet.com/";
const keyword: string = "clorox toilet wand refills";

const main = async (): Promise<void> => {
    logger.info("Start scraping");

    logger.info("Creating headless browser");
    const browser: Browser = await puppeteer.launch({ headless: false });

    const page: Page = await browser.newPage();
    page.setViewport({ height: 1000, width: 1000 });
    page.goto(address);

    page.once("load", async () => {
        await page.waitFor(1000);

        await page.click("#MobileSearchBarInput");

        await page.waitFor(1000);

        await page.keyboard.type("clorox toilet wand refills");

        await page.waitFor(1000);
        await page.keyboard.press("Enter");
        await page.waitFor(2000);

        const hits = await page.$$(".fSSCaC");

        if (hits && hits.length > 0) {
            await page.screenshot({
                path: `${keyword.split(" ").join("_")}.jpeg`,
            });
        }

        await page.waitFor(3000);

        logger.info("Terminating headless browser");
        browser.close();
    });
};

main();
