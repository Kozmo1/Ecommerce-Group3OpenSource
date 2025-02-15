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
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../infrastructure/mongodb/models/user");
const express_validator_1 = require("express-validator");
class UserController {
    // Register user
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const { name, email, password } = req.body;
                const salt = yield bcrypt_1.default.genSalt(10);
                const hashedPassword = yield bcrypt_1.default.hash(password, salt);
                const newUser = new user_1.User({
                    name,
                    email,
                    password: hashedPassword
                });
                yield newUser.save();
                res.status(201).json({ message: 'User created successfully' });
            }
            catch (error) {
                console.error('Error registering user', error);
                res.status(500).json({ message: 'Error registering user' });
            }
        });
    }
    // Login user
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const { email, password } = req.body;
                const user = yield user_1.User.findOne({ email });
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                const isMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!isMatch) {
                    res.status(401).json({ message: 'Invalid credentials' });
                    return;
                }
                res.status(200).json({ message: 'User logged in successfully', user: { id: user._id, email: user.email } });
            }
            catch (error) {
                console.error('Error logging in user', error);
                res.status(500).json({ message: 'Error logging in user' });
            }
        });
    }
    // Get user by ID
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.User.findById(req.params.id);
                if (!user) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(user);
            }
            catch (error) {
                console.error('Error getting user', error);
                res.status(500).json({ message: 'Error getting user' });
            }
        });
    }
    // Update user by ID
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateUser = yield user_1.User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
                if (!updateUser) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json(updateUser);
            }
            catch (error) {
                console.error('Error updating user', error);
                res.status(500).json({ message: 'Error updating user' });
            }
        });
    }
    // Delete user by ID
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const deleteUser = yield user_1.User.findByIdAndDelete(req.params.id);
                if (!deleteUser) {
                    res.status(404).json({ message: 'User not found' });
                    return;
                }
                res.status(200).json({ message: 'User deleted successfully' });
            }
            catch (error) {
                console.error('Error deleting user', error);
                res.status(500).json({ message: 'Error deleting user' });
            }
        });
    }
    // logout user
    logout(req, res, next) {
        res.status(200).json({ message: 'User logged out successfully' });
    }
    // Update User's Taste Profile
    updateTasteProfile(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({ errors: errors.array() });
                return;
            }
            try {
                const userId = req.params.id;
                const tasteProfile = req.body.tasteProfile;
                const user = yield user_1.User.findById(userId);
                if (user) {
                    user.tasteProfile = Object.assign(Object.assign({}, user.tasteProfile), tasteProfile);
                    yield user.save();
                    res.status(200).json({ message: 'Taste Profile updated successfully', user });
                }
                else {
                    res.status(404).json({ message: 'User not found' });
                }
            }
            catch (error) {
                console.error('Error updating taste profile', error);
                res.status(500).json({ message: 'Error updating taste profile' });
            }
        });
    }
}
exports.UserController = UserController;
