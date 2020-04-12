import _ from "lodash";
import path from "path";
import fs from "fs";

export interface Attachment {
    filename: string;
    path: string;
    cid: string;
}

export const htmlBuilder = (): string => {
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

export const attachmentsBuilder = (): Attachment[] => {
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
