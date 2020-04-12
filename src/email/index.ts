import nodemailer, { Transporter } from "nodemailer";
import logger from "../logging";

const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const MAIL_LIST = ["weiyushen1012@yahoo.com"];

export const sendMail = (): void => {
    MAIL_LIST.forEach((to) => {
        transporter.sendMail(
            {
                from: "weiyuaws@gmail.com",
                to,
                subject: "test",
                html: "<h1>Hello</h1>",
            },
            (err, info) => {
                if (err) {
                    logger.error(err);
                } else {
                    logger.info(info);
                }
            }
        );
    });
};
