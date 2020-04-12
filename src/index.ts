import logger from "./logging";
import puppeteer, { Browser } from "puppeteer";
import jet from "./sites/jet";
import { sendResult } from "./email";
import dotenv from "dotenv";
import fs from "fs";
import schedule from "node-schedule";
import path from "path";

dotenv.config();

const HEADLESS: boolean = true;

const main = async (): Promise<void> => {
    logger.info("----BEGIN----");

    const screenshotsDir = path.resolve(__dirname, "..", "screenshots");
    if (fs.existsSync(screenshotsDir)) {
        logger.warn("Removing previous screenshots");

        const files = fs.readdirSync(screenshotsDir);

        for (let i = 0; i < files.length; i++) {
            fs.unlinkSync(
                path.resolve(__dirname, "..", "screenshots", files[i])
            );
        }
    }

    logger.info("Creating headless browser");
    const browser: Browser = await puppeteer.launch({
        headless: HEADLESS,
    });

    logger.info("Scraping Jet");
    await jet(browser);

    await browser.close();

    await sendResult();
    logger.info("----END----");
};

const runType: string = process.argv[2];

if (!runType || runType === "immediately" || runType === "i") {
    main();
} else if (runType === "scheduled" || runType === "s") {
    const minute = process.argv[3];
    const hour = process.argv[4];

    const cron: string = `${minute || 0} ${hour || 0} * * *`;

    logger.info(`Scheduled task with cron ${cron}`);

    schedule.scheduleJob(cron, () => {
        main();
    });
} else {
    logger.error("Unknown run type");
}
