import nodemailer, { Transporter } from "nodemailer";
import logger from "../logging";
import path from "path";
import fs from "fs";
import _ from "lodash";
import { mailList } from "./mailList";

interface Attachment {
    filename: string;
    path: string;
    cid: string;
}

const htmlBuilder = (): string => {
    try {
        let res = "";

        res += `<div>${new Date()}<div>`;

        const screenshots = fs.readdirSync(
            path.resolve(__dirname, "../..", "screenshots")
        );

        for (let i = 0; i < screenshots.length; i++) {
            res += `<h2>${screenshots[i]
                .split(".")[0]
                .split("_")
                .map((word) => _.capitalize(word))
                .join(" ")}</h2><div><img style='width:800px' src="cid:${
                screenshots[i]
            }" /><div>`;
        }

        return res;
    } catch (error) {
        return "";
    }
};

const attachmentsBuilder = (): Attachment[] => {
    try {
        const res = [];

        const screenshots = fs.readdirSync(
            path.resolve(__dirname, "../..", "screenshots")
        );

        for (let i = 0; i < screenshots.length; i++) {
            res.push({
                filename: screenshots[i],
                path: path.resolve(
                    __dirname,
                    "../..",
                    "screenshots",
                    screenshots[i]
                ),
                cid: screenshots[i],
            });
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

        mailList.forEach((to: string) => {
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
