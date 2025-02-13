"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
dotenv_safe_1.default.config({ allowEmptyValues: true, path: `.env.${process.env.NODE_ENV}` }); // Load environment variables from .env file
const ENVIRONMENT = (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development"; // Set the environment to development if not specified
const MONGO_HOST = (_b = process.env.MONGO_HOST) !== null && _b !== void 0 ? _b : ""; // Get the MongoDB host from the environment variables
const MONGO_DATABASE = (_c = process.env.MONGO_DATABASE) !== null && _c !== void 0 ? _c : ""; // Get the MongoDB database from the environment variables
const MONGO_PORT = (_d = process.env.MONGO_PASSWORD) !== null && _d !== void 0 ? _d : ""; // Get the MongoDB port from the environment variables
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`; // Create the MongoDB URL
exports.config = {
    environment: ENVIRONMENT,
    mongo: {
        url: MONGO_URL
    }
};
