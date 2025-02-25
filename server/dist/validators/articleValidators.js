"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.articleValidators = void 0;
const express_validator_1 = require("express-validator");
const articleValidators = () => {
    return [
        (0, express_validator_1.body)("owner").escape(),
        (0, express_validator_1.body)("color").escape(),
        (0, express_validator_1.body)("header").escape(),
        (0, express_validator_1.body)("content").escape(),
        (0, express_validator_1.body)("tags").escape()
    ];
};
exports.articleValidators = articleValidators;
