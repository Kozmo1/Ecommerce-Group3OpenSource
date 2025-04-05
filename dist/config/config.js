"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config({
    allowEmptyValues: true,
    path: `.env.${process.env.NODE_ENV || "local"}`,
    example: ".env.example",
});
const ENVIRONMENT = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
const JWT_SECRET = (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "default-secret";
const BREWERY_API_URL = (_c = process.env.BREWERY_API_URL) !== null && _c !== void 0 ? _c : "http://localhost:5089";
const PORT = (_d = process.env.PORT) !== null && _d !== void 0 ? _d : "3000";
exports.config = {
    environment: ENVIRONMENT,
    jwtSecret: JWT_SECRET,
    breweryApiUrl: BREWERY_API_URL,
    port: PORT,
};
