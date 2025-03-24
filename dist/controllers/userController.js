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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const axios_1 = __importDefault(require("axios"));
const express_validator_1 = require("express-validator");
const config_1 = require("../config/config");
class UserController {
    constructor() {
        this.breweryApiUrl = config_1.config.breweryApiUrl;
    }
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/register`, req.body);
                res.status(201).json(response.data); // { id, email }
            }
            catch (error) {
                console.error("Error registering user:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
                    message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Error registering user",
                    error: ((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.errors) || error.message,
                });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/login`, req.body);
                res.status(200).json(response.data); // { token }
            }
            catch (error) {
                console.error("Error logging in:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 401).json({
                    message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Invalid credentials",
                    error: ((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.errors) || error.message,
                });
            }
        });
    }
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                const response = yield axios_1.default.get(`${this.breweryApiUrl}/api/auth/${req.params.id}`);
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== response.data.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                res.status(200).json(response.data); // { id, email, name, tasteProfile }
            }
            catch (error) {
                console.error("Error fetching user:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 404).json({
                    message: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "User not found",
                    error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors) || error.message,
                });
            }
        });
    }
    logout(req, res, next) {
        // Since JWT is stateless, logout is client-side (discard token)
        res.status(200).json({ message: "User logged out successfully" });
    }
    updateTasteProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const response = yield axios_1.default.put(`${this.breweryApiUrl}/api/auth/${req.params.id}/taste-profile`, req.body);
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                res.status(200).json({
                    message: "Taste profile updated successfully",
                    tasteProfile: response.data.tasteProfile,
                });
            }
            catch (error) {
                console.error("Error updating taste profile:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                    message: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) ||
                        "Error updating taste profile",
                    error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors) || error.message,
                });
            }
        });
    }
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                const response = yield axios_1.default.get(`${this.breweryApiUrl}/api/order/user/${req.params.id}`);
                res.status(200).json(response.data); // Assuming array of orders
            }
            catch (error) {
                console.error("Error fetching user orders:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                    message: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "Error fetching orders",
                    error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors) || error.message,
                });
            }
        });
    }
}
exports.UserController = UserController;
