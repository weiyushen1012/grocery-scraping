import nodemailer, { Transporter } from "nodemailer";
import logger from "../logging";
import path from "path";
import fs from "fs";
import _ from "lodash";

const MAIL_LIST = ["weiyushen1012@yahoo.com"];

interface Attachment {
    filename: string;
    path: string;
    cid: string;
}

const htmlBuilder = (): string => {
    try {
        const sites: string[] = fs.readdirSync(
            path.resolve(__dirname, "..", "sites")
        );

        let res = "";

        res += `<div>${new Date()}<div>`;

        for (let i = 0; i < sites.length; i++) {
            const screenshots = fs.readdirSync(
                path.resolve(__dirname, "..", "sites", sites[i], "screenshots")
            );

            for (let j = 0; j < screenshots.length; j++) {
                res += `<h2>${screenshots[j]
                    .split(".")[0]
                    .split("_")
                    .map((word) => _.capitalize(word))
                    .join(" ")}</h2><div><img style='width:800px' src="cid:${
                    screenshots[j]
                }" /><div>`;
            }
        }

        return res;
    } catch (error) {
        return "";
    }
};

const attachmentsBuilder = (): Attachment[] => {
    try {
        const sites: string[] = fs.readdirSync(
            path.resolve(__dirname, "..", "sites")
        );

        const res = [];

        for (let i = 0; i < sites.length; i++) {
            const screenshots = fs.readdirSync(
                path.resolve(__dirname, "..", "sites", sites[i], "screenshots")
            );

            for (let j = 0; j < screenshots.length; j++) {
                res.push({
                    filename: `screenshots[j]`,
                    path: path.resolve(
                        __dirname,
                        "..",
                        "sites",
                        sites[i],
                        "screenshots",
                        screenshots[j]
                    ),
                    cid: screenshots[j],
                });
            }
        }

        return res;
    } catch (error) {
        return null;
    }
};

export const sendResult = async (): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const html: string = htmlBuilder();
    const attachments: Attachment[] = attachmentsBuilder();

    return new Promise((resolve, reject) => {
        if (!attachments || !attachments.length) {
            logger.warn("No hits found");
            resolve();
            return;
        }

        MAIL_LIST.forEach((to) => {
            transporter.sendMail(
                {
                    from: process.env.EMAIL_ACCOUNT,
                    to,
                    subject: "New Groceries Available",
                    html,
                    attachments,
                },
                (err) => {
                    if (err) {
                        logger.error(err);
                        reject();
                    } else {
                        logger.info("sent result as email");
                        resolve();
                    }
                }
            );
        });
    });
};
