"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
// Load environment variables from .env file based on NODE_ENV or default to .env.local
dotenv_safe_1.default.config({
    allowEmptyValues: true,
    path: `.env.${process.env.NODE_ENV || "local"}`,
    example: ".env.example",
});
// Set the environment to development if not specified
const ENVIRONMENT = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
// Set the JWT secret (used for token verification in Node.js)
const JWT_SECRET = (_b = process.env.JWT_SECRET) !== null && _b !== void 0 ? _b : "ThisIsMySuperSecretKeyForSchoolProject12345!";
// Set the Brewery_DB_Service API URL
const BREWERY_API_URL = (_c = process.env.BREWERY_API_URL) !== null && _c !== void 0 ? _c : "http://localhost:5089";
exports.config = {
    environment: ENVIRONMENT,
    jwtSecret: JWT_SECRET,
    breweryApiUrl: BREWERY_API_URL,
};
