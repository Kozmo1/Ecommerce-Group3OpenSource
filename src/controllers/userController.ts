import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { User } from '../infrastructure/mongodb/models/user';
import { body, validationResult } from 'express-validator';

export class UserController {

    // Register user
    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const {name, email, password} = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });
            await newUser.save();
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Error registering user', error);
            res.status(500).json({ message: 'Error registering user' });
        }

    }

    // Login user
    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const {email, password} = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            res.status(200).json({ message: 'User logged in successfully', user: {id: user._id, email: user.email} });
        } catch (error) {
            console.error('Error logging in user', error);
            res.status(500).json({ message: 'Error logging in user' });
        }
    }

    // Get user by ID
    public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(user);
        } catch (error) {
            console.error('Error getting user', error);
            res.status(500).json({ message: 'Error getting user' });
        }
    }

    // Update user by ID
    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const updateUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
            if (!updateUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json(updateUser);
        } catch (error) {
            console.error('Error updating user', error);
            res.status(500).json({ message: 'Error updating user' });
        }
    }

    // Delete user by ID
    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleteUser = await User.findByIdAndDelete(req.params.id);
            if (!deleteUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error deleting user', error);
            res.status(500).json({ message: 'Error deleting user' });
        }
    }

    // logout user
    public logout(req: Request, res: Response, next: NextFunction) {
        res.status(200).json({ message: 'User logged out successfully' });
    }

    // Update User's Taste Profile
    public async updateTasteProfile(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        try {
            const userId = req.params.id;
            const tasteProfile = req.body.tasteProfile;

            const user = await User.findById(userId);
            if (user) {
                user.tasteProfile = { ...user.tasteProfile, ...tasteProfile };
                await user.save();
                res.status(200).json({ message: 'Taste Profile updated successfully', user });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Error updating taste profile', error);
            res.status(500).json({ message: 'Error updating taste profile' });
        }
    }
}

