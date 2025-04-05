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
const express_validator_1 = require("express-validator");
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../config/config");
class UserController {
    constructor() {
        // Hey, I’m grabbing the Brewery API URL from my config—gonna need this for all my requests!
        this.breweryApiUrl = config_1.config.breweryApiUrl;
    }
    // This is my register method—lets new users sign up, so cool!
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            // First, I’m checking if there are any validation errors—like, did they mess up the email?
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                // Alright, I’m sending the user’s info to the Database Service to register them
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/register`, req.body);
                // Sweet, it worked! Sending back the user’s ID and email with a 201 status
                res.status(201).json(response.data); // { id, email }
            }
            catch (error) {
                // Uh-oh, something broke! I’m logging the error so I can figure out what’s up
                console.error("Error registering user:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                // Sending back an error message to the user—let’s be nice about it
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({
                    message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Error registering user",
                    error: ((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.errors) || error.message,
                });
            }
        });
    }
    // This is my login method—gotta let users in, right?
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            // Checking for validation errors again—gotta make sure the email and password are good
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                // Sending the login info to the Database Service to get a token
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/login`, req.body);
                // Nice, they’re in! Sending back the token with a 200 status
                res.status(200).json(response.data); // { token }
            }
            catch (error) {
                // Oops, login didn’t work—maybe wrong password? Logging the error
                console.error("Error logging in:", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                // Telling the user something went wrong—probably invalid credentials
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 401).json({
                    message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Invalid credentials",
                    error: ((_f = (_e = error.response) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.errors) || error.message,
                });
            }
        });
    }
    // This method grabs a user by their ID—super handy for getting user details
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                // Check authorization first
                if (!((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || req.user.id !== req.params.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                const response = yield axios_1.default.get(`${this.breweryApiUrl}/api/auth/${req.params.id}`);
                res.status(200).json(response.data);
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
    // This is my logout method—pretty simple since JWT is stateless
    logout(req, res, next) {
        // I’m just telling the client to ditch the token on their end—easy peasy!
        res.status(200).json({ message: "User logged out successfully" });
    }
    // This method lets users update their taste profile—like, what kind of beer they love!
    updateTasteProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            // Checking for validation errors—gotta make sure the taste profile stuff is legit
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                // Sending the updated taste profile to the Database Service
                const response = yield axios_1.default.put(`${this.breweryApiUrl}/api/auth/${req.params.id}/taste-profile`, req.body);
                // Making sure the user can only update their own profile—safety first!
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                // Awesome, it worked! Sending back a success message and the new taste profile
                res.status(200).json({
                    message: "Taste profile updated successfully",
                    tasteProfile: response.data.tasteProfile,
                });
            }
            catch (error) {
                // Uh-oh, something broke while updating—logging the error to see what’s up
                console.error("Error updating taste profile:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                // Telling the user something went wrong—let’s keep it friendly
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                    message: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) ||
                        "Error updating taste profile",
                    error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors) || error.message,
                });
            }
        });
    }
    // This method grabs all the orders for a user—super useful for order history!
    getUserOrders(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g;
            try {
                // Making sure the user can only see their own orders—gotta keep things secure
                if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== req.params.id) {
                    res.status(403).json({ message: "Unauthorized" });
                    return;
                }
                // Asking the Database Service for the user’s orders
                const response = yield axios_1.default.get(`${this.breweryApiUrl}/api/order/user/${req.params.id}`);
                // Got the orders! Sending them back with a 200 status
                res.status(200).json(response.data); // Assuming array of orders
            }
            catch (error) {
                // Something went wrong while fetching orders—logging the error
                console.error("Error fetching user orders:", ((_b = error.response) === null || _b === void 0 ? void 0 : _b.data) || error.message);
                // Letting the user know we couldn’t get their orders
                res.status(((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) || 500).json({
                    message: ((_e = (_d = error.response) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.message) || "Error fetching orders",
                    error: ((_g = (_f = error.response) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.errors) || error.message,
                });
            }
        });
    }
}
exports.UserController = UserController;
