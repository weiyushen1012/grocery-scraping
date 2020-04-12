"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logging_1 = __importDefault(require("../logging"));
const util_1 = require("./util");
const mailList_1 = require("./mailList");
const sesTransport = require("nodemailer-ses-transport");
exports.sendResult = () => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport(sesTransport({
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        rateLimit: 5,
    }));
    const html = util_1.htmlBuilder();
    const attachments = util_1.attachmentsBuilder();
    return new Promise((resolve, reject) => {
        if (!attachments || !attachments.length) {
            logging_1.default.warn("No hits found");
            resolve();
            return;
        }
        mailList_1.mailList.forEach((to) => {
            transporter.sendMail({
                from: process.env.EMAIL,
                to,
                subject: "New Groceries Available",
                html,
                attachments,
            }, (err) => {
                if (err) {
                    logging_1.default.error(err);
                    reject();
                }
                else {
                    logging_1.default.info("sent result as email");
                    resolve();
                }
            });
        });
    });
});
//# sourceMappingURL=index.js.map