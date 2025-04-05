"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config/config");
const axios_1 = __importDefault(require("axios"));
const dependencies = {
    config: config_1.config,
    httpClient: axios_1.default,
};
exports.default = dependencies;
