"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const dotenv_expand_1 = __importDefault(require("dotenv-expand"));
require("@avidian/extras");
const mail_1 = require("./routes/mail");
const sms_1 = require("./routes/sms");
(0, dotenv_expand_1.default)((0, dotenv_1.config)());
const app = (0, express_1.default)();
app.use((0, express_1.json)());
app.use((0, express_1.urlencoded)({ extended: true }));
app.use((0, cors_1.default)());
app.use('/mail', mail_1.mailRoutes);
app.use('/sms', sms_1.smsRoutes);
app.use((_, res) => {
    return res.status(404).end();
});
app.use((error, _req, res, _next) => {
    console.error(error.message);
    return res.status(error.status || 500).json(error.toObject());
});
app.listen(process.env.PORT || 8000);
