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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const connection_1 = require("../../../infrastructure/mongodb/connection");
const user_1 = require("../../../infrastructure/mongodb/models/user");
const express_validator_1 = require("express-validator");
const userDb = [];
const router = express_1.default.Router();
(0, connection_1.ConnectToDb)();
router.post('/users/register', // Express validator middleware
(0, express_validator_1.body)('name').notEmpty().withMessage('Name is required'), (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(), (0, express_validator_1.body)('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req); // Finds the validation errors in this request and wraps them in an object with handy functions
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { name, email, password } = req.body; // Destructure the request body
        const salt = yield bcrypt_1.default.genSalt(10); // Generate a salt with 10 rounds
        const hashedPassword = yield bcrypt_1.default.hash(password, salt); // Hash the password with the salt
        const newUser = new user_1.User({
            name: name,
            email: email,
            password: hashedPassword
        });
        yield newUser.save(); // Save the user document to the database
        res.status(201).json({ message: 'User registered successfully' });
    }
    catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ message: 'Error registering user' });
    }
}));
router.post("/users/login", (0, express_validator_1.body)('email').isEmail().withMessage('Invalid email format').normalizeEmail(), (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { email, password } = req.body; // Destructure the request body
        const user = yield user_1.User.findOne({ email }); // Find the user by email
        if (!user) {
            res.status(404).json({ message: "User not found" }); // Return a 404 if the user is not found
            return;
        }
        const isValidPassword = yield bcrypt_1.default.compare(password, user.password); // Compare the password with the hashed password
        if (!isValidPassword) {
            res.status(401).json({ message: "Invalid credentials" }); // Return a 401 if the password is incorrect
            return;
        }
        res.status(200).json({
            message: "User logged in successfully!", // Return a 200 if the user is logged in successfully
            user: { id: user._id, name: user.name, email: user.email }
        });
    }
    catch (error) {
        console.error(`Error in login: ${error}`);
        res.status(500).json({ message: "Error during login" });
    }
}));
//Additional Endpoints we might need
router.get("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield user_1.User.findById(userId);
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching user" });
    }
}));
router.put("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const updateUser = yield user_1.User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true });
        if (updateUser) {
            res.json(updateUser);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating user" });
    }
}));
router.delete("/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const deleteUser = yield user_1.User.findByIdAndDelete(userId);
        if (deleteUser) {
            res.json(deleteUser);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting user" });
    }
}));
router.post("/logout", (req, res) => {
    res.json({ message: "User logged out successfully" });
});
router.post('/users/:id/taste-profile', // Update a user's taste profile
(0, express_validator_1.body)('tasteProfile').isObject().withMessage('Taste profile must be an object'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const newTasteProfile = req.body.tasteProfile;
        const user = yield user_1.User.findById(userId);
        if (user) {
            if (user.tasteProfile) {
                user.tasteProfile = Object.assign(Object.assign({}, user.tasteProfile), newTasteProfile);
            }
            else {
                user.tasteProfile = newTasteProfile;
            }
            yield user.save();
            res.json({ message: 'Taste profile updated', user });
        }
        else {
            res.status(404).send('User not found');
        }
    }
    catch (error) {
        res.status(500).json({ message: "Error updating taste profile" });
    }
}));
module.exports = router;
