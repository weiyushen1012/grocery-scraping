import nodemailer, { Transporter } from "nodemailer";
import logger from "../logging";
import { Attachment, htmlBuilder, attachmentsBuilder } from "./util";
import _ from "lodash";
import { mailList } from "./mailList";

const sesTransport = require("nodemailer-ses-transport");

export const sendResult = async (): Promise<void> => {
    const transporter: Transporter = nodemailer.createTransport(
        sesTransport({
            accessKeyId: process.env.AWS_KEY,
            secretAccessKey: process.env.AWS_SECRET,
            rateLimit: 5,
        })
    );

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
                    from: process.env.EMAIL,
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
