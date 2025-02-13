"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectToDb = void 0;
const mongoose_1 = require("mongoose");
const config_1 = require("../../config/config");
const mongoDb = config_1.config.mongo.url; // Get the MongoDB URL from the configuration object
const ConnectToDb = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, mongoose_1.connect)(mongoDb);
        console.log('Connected to MongoDB');
    }
    catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
});
exports.ConnectToDb = ConnectToDb;
