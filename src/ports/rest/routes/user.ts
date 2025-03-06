import express, { Request, Response, NextFunction } from "express";
import { UserController } from "../../../controllers/userController";
import { body } from "express-validator";
import { verifyToken, AuthRequest } from "../../../middleware/auth";

const router = express.Router();
const userController = new UserController();

// Register user
router.post(
	"/register",
	body("name").notEmpty().withMessage("Name is required"),
	body("email")
		.isEmail()
		.withMessage("Invalid email format")
		.normalizeEmail(),
	body("password")
		.isLength({ min: 6 })
		.withMessage("Password must be at least 6 characters"),
	(req: Request, res: Response, next: NextFunction) =>
		userController.register(req, res, next)
);

// Login user
router.post(
	"/login",
	body("email")
		.isEmail()
		.withMessage("Invalid email format")
		.normalizeEmail(),
	body("password").notEmpty().withMessage("Password is required"),
	(req: Request, res: Response, next: NextFunction) =>
		userController.login(req, res, next)
);

//Get user by ID
router.get(
	"/:id",
	verifyToken,
	(req: Request, res: Response, next: NextFunction) =>
		userController.getUserById(req, res, next)
);

// update taste profile
router.put(
	"/:id/taste-profile",
	verifyToken,
	body("tasteProfile.primaryFlavor")
		.optional()
		.isString()
		.withMessage("Primary flavor must be a string"),
	body("tasteProfile.sweetness")
		.optional()
		.isString()
		.withMessage("Sweetness must be a string"),
	body("tasteProfile.bitterness")
		.optional()
		.isString()
		.withMessage("Bitterness must be a string"),
	(req: AuthRequest, res: Response, next: NextFunction) =>
		userController.updateTasteProfile(req, res, next)
);

//   // Logout user
router.post("/logout", (req: Request, res: Response, next: NextFunction) =>
	userController.logout(req, res, next)
);

// Get user orders
router.get(
	"/:id/orders",
	verifyToken,
	(req: AuthRequest, res: Response, next: NextFunction) =>
		userController.getUserOrders(req, res, next)
);

export = router;
