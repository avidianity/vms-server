"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailRoutes = exports.send = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
require("express-async-errors");
const nodemailer_1 = require("nodemailer");
const routes = (0, express_1.Router)();
routes.post('/', [(0, express_validator_1.body)('email').isEmail().notEmpty(), (0, express_validator_1.body)('message').isString().notEmpty(), (0, express_validator_1.body)('subject').isString().notEmpty()], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    }
    const transport = (0, nodemailer_1.createTransport)({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT?.toNumber(),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        secure: process.env.MAIL_SECURE === 'true',
    });
    try {
        await verify(transport);
    }
    catch (error) {
        return res.status(500).json({
            message: 'Transport has invalid configuration.',
            error: error.toObject(),
        });
    }
    const response = await send(transport, {
        to: req.body.email,
        text: req.body.message,
        html: req.body.message,
        sender: process.env.MAIL_FROM,
        from: process.env.MAIL_FROM,
        subject: req.body.subject,
    });
    return res.json(response);
});
function verify(transport) {
    return new Promise((resolve, reject) => {
        transport.verify((error, success) => {
            if (error) {
                return reject(error);
            }
            return resolve(success);
        });
    });
}
function send(transport, config) {
    return new Promise((resolve, reject) => {
        transport.sendMail(config, (error, result) => {
            if (error) {
                return reject(error);
            }
            return resolve(result);
        });
    });
}
exports.send = send;
exports.mailRoutes = routes;
