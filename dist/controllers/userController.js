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
        // Get user by ID (protected)
        // public async getUserById(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        //   try {
        //     const user = await User.findById(req.params.id).select("-password"); // Exclude password
        //     if (!user) {
        //       res.status(404).json({ message: "User not found" });
        //       return;
        //     }
        //     res.status(200).json(user);
        //   } catch (error) {
        //     console.error("Error getting user", error);
        //     res.status(500).json({ message: "Error getting user" });
        //   }
        // }
        // // Update user by ID (protected)
        // public async updateUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        //   try {
        //     const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        //       new: true,
        //       runValidators: true,
        //     }).select("-password");
        //     if (!updatedUser) {
        //       res.status(404).json({ message: "User not found" });
        //       return;
        //     }
        //     res.status(200).json(updatedUser);
        //   } catch (error) {
        //     console.error("Error updating user", error);
        //     res.status(500).json({ message: "Error updating user" });
        //   }
        // }
        // // Delete user by ID (protected)
        // public async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        //   try {
        //     const deletedUser = await User.findByIdAndDelete(req.params.id);
        //     if (!deletedUser) {
        //       res.status(404).json({ message: "User not found" });
        //       return;
        //     }
        //     res.status(200).json({ message: "User deleted successfully" });
        //   } catch (error) {
        //     console.error("Error deleting user", error);
        //     res.status(500).json({ message: "Error deleting user" });
        //   }
        // }
        // // Logout user 
        // public logout(req: Request, res: Response, next: NextFunction) {
        //   res.status(200).json({ message: "User logged out successfully" });
        // }
        // // Update User's Taste Profile (protected)
        // public async updateTasteProfile(req: AuthRequest, res: Response, next: NextFunction) {
        //   const errors = validationResult(req);
        //   if (!errors.isEmpty()) {
        //     res.status(400).json({ errors: errors.array() });
        //     return;
        //   }
        //   try {
        //     const userId = req.params.id;
        //     const tasteProfile = req.body.tasteProfile;
        //     const user = await User.findById(userId);
        //     if (!user) {
        //       res.status(404).json({ message: "User not found" });
        //       return;
        //     }
        //     user.tasteProfile = { ...user.tasteProfile, ...tasteProfile };
        //     await user.save();
        //     res.status(200).json({ message: "Taste Profile updated successfully", user });
        //   } catch (error) {
        //     console.error("Error updating taste profile", error);
        //     res.status(500).json({ message: "Error updating taste profile" });
        //   }
        // }
    }
    // Register user
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const { name, email, password } = req.body;
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/Register`, {
                    name,
                    email,
                    password,
                });
                res.status(201).json(response.data);
            }
            catch (error) {
                console.error("Error registering user", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({ message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Error registering user" });
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const { email, password } = req.body;
                const response = yield axios_1.default.post(`${this.breweryApiUrl}/api/auth/Login`, {
                    email,
                    password,
                });
                res.status(200).json(response.data);
            }
            catch (error) {
                console.error("Error logging in user", ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
                res.status(((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 500).json({ message: ((_d = (_c = error.response) === null || _c === void 0 ? void 0 : _c.data) === null || _d === void 0 ? void 0 : _d.message) || "Error logging in" });
            }
        });
    }
}
exports.UserController = UserController;
