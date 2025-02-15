"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../../controllers/userController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
const userController = new userController_1.UserController();
// Register user
router.post('/register', (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'), (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), (req, res, next) => userController.register(req, res, next));
// Login user
router.post("/login", (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(), (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'), (req, res, next) => userController.login(req, res, next));
// Get user by ID
router.get("/:id", (req, res, next) => userController.getUserById(req, res, next));
// Update user
router.put("/:id", (req, res, next) => userController.updateUser(req, res, next));
// Delete user
router.delete("/:id", (req, res, next) => userController.deleteUser(req, res, next));
// Logout user
router.post("/logout", (req, res, next) => userController.logout(req, res, next));
// Update taste profile
router.post('/:id/taste-profile', (0, express_validator_1.body)('tasteProfile').isObject().withMessage('Taste profile must be an object'), (req, res, next) => userController.updateTasteProfile(req, res, next));
module.exports = router;
