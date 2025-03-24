"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../../controllers/userController");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../../middleware/auth");
const router = express_1.default.Router();
const userController = new userController_1.UserController();
// Register user
router.post("/register", (0, express_validator_1.body)("name").notEmpty().withMessage("Name is required"), (0, express_validator_1.body)("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(), (0, express_validator_1.body)("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"), (req, res, next) => userController.register(req, res, next));
// Login user
router.post("/login", (0, express_validator_1.body)("email")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(), (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"), (req, res, next) => userController.login(req, res, next));
//Get user by ID
router.get("/:id", auth_1.verifyToken, (req, res, next) => userController.getUserById(req, res, next));
// update taste profile
router.put("/:id/taste-profile", auth_1.verifyToken, (0, express_validator_1.body)("tasteProfile.primaryFlavor")
    .optional()
    .isString()
    .withMessage("Primary flavor must be a string"), (0, express_validator_1.body)("tasteProfile.sweetness")
    .optional()
    .isString()
    .withMessage("Sweetness must be a string"), (0, express_validator_1.body)("tasteProfile.bitterness")
    .optional()
    .isString()
    .withMessage("Bitterness must be a string"), (req, res, next) => userController.updateTasteProfile(req, res, next));
//   // Logout user
router.post("/logout", (req, res, next) => userController.logout(req, res, next));
// Get user orders
router.get("/:id/orders", auth_1.verifyToken, (req, res, next) => userController.getUserOrders(req, res, next));
module.exports = router;
