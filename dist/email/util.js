"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.htmlBuilder = () => {
    try {
        let res = "";
        res += `<div>${new Date()}<div>`;
        const screenshots = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "../..", "screenshots"));
        for (let i = 0; i < screenshots.length; i++) {
            res += `<h2>${screenshots[i]
                .split(".")[0]
                .split("_")
                .map((word) => lodash_1.default.capitalize(word))
                .join(" ")}</h2><div><img style='width:800px' src="cid:${screenshots[i]}" /><div>`;
        }
        return res;
    }
    catch (error) {
        return "";
    }
};
exports.attachmentsBuilder = () => {
    try {
        const res = [];
        const screenshots = fs_1.default.readdirSync(path_1.default.resolve(__dirname, "../..", "screenshots"));
        for (let i = 0; i < screenshots.length; i++) {
            res.push({
                filename: screenshots[i],
                path: path_1.default.resolve(__dirname, "../..", "screenshots", screenshots[i]),
                cid: screenshots[i],
            });
        }
        return res;
    }
    catch (error) {
        return null;
    }
};
//# sourceMappingURL=util.js.map