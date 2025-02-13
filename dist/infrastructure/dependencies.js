"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const mongoDbClient_1 = __importDefault(require("./mongodb/mongoDbClient"));
const dependencies = {
    config: // Export the dependencies object
    config_1.config,
    mongoDbClient: mongoDbClient_1.default
};
exports.default = dependencies;
