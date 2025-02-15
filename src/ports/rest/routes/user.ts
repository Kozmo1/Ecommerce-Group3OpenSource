import express, { Request, Response, NextFunction } from 'express';
import { UserController } from '../../../controllers/userController';
import { body } from 'express-validator';

const router = express.Router();
const userController = new UserController();

// Register user
router.post('/register',
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  (req: Request, res: Response, next: NextFunction) => userController.register(req, res, next));

  // Login user
router.post("/login",
  body('email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  (req: Request, res: Response, next: NextFunction) => userController.login(req, res, next));

  // Get user by ID
router.get("/:id", 
  (req: Request, res: Response, next: NextFunction) => userController.getUserById(req, res, next));

  // Update user
router.put("/:id", 
  (req: Request, res: Response, next: NextFunction) => userController.updateUser(req, res, next));

  // Delete user
router.delete("/:id", 
  (req: Request, res: Response, next: NextFunction) => userController.deleteUser(req, res, next));

  // Logout user
router.post("/logout",
  (req: Request, res: Response, next: NextFunction) => userController.logout(req, res, next));

  // Update taste profile
router.post('/:id/taste-profile',
  body('tasteProfile').isObject().withMessage('Taste profile must be an object'),
  (req: Request, res: Response, next: NextFunction) => userController.updateTasteProfile(req, res, next));

export = router;