"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsRoutes = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
require("express-async-errors");
const semaphorejs_1 = __importDefault(require("@avidian/semaphorejs"));
const helpers_1 = require("../helpers");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.body)('numbers')
        .isArray()
        .custom((value) => {
        if (!Array.isArray(value)) {
            return false;
        }
        for (const entry of value) {
            if (!/^(\+639|639|09)\d{9}$/.test(entry)) {
                return false;
            }
        }
        return true;
    }),
    (0, express_validator_1.body)('message').isString().notEmpty(),
], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const client = new semaphorejs_1.default(process.env.SEMAPHORE_TOKEN, {
        baseUrl: process.env.SEMAPHORE_URL,
    });
    try {
        const response = await client.send(req.body.numbers, req.body.message);
        return res.json(response);
    }
    catch (error) {
        const response = (0, helpers_1.getErrorResponse)(error);
        return res.status(response?.status || 500).json(response?.data);
    }
});
exports.smsRoutes = router;
