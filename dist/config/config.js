"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
// Load environment variables from .env file based on NODE_ENV or default to .env.local
dotenv_safe_1.default.config({
    allowEmptyValues: true,
    path: `.env.${process.env.NODE_ENV || "local"}`, // Load .env.local if NODE_ENV is not set
    example: '.env.example' // Specify the example file explicitly
});
// Set the environment to development if not specified
const ENVIRONMENT = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
// MongoDB configuration from environment variables
const MONGO_HOST = (_b = process.env.MONGO_HOST) !== null && _b !== void 0 ? _b : "";
const MONGO_DATABASE = (_c = process.env.MONGO_DATABASE) !== null && _c !== void 0 ? _c : "";
const MONGO_PORT = (_d = process.env.MONGO_PORT) !== null && _d !== void 0 ? _d : "";
const MONGO_PASSWORD = (_e = process.env.MONGO_PASSWORD) !== null && _e !== void 0 ? _e : "";
// Create the MongoDB URL. Note: You might want to handle the password here if needed
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
exports.config = {
    environment: ENVIRONMENT,
    mongo: {
        url: MONGO_URL
    }
};
