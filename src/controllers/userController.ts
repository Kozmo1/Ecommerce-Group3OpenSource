import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { body, validationResult } from "express-validator";
import { config } from "../config/config";
import { AuthRequest } from "../middleware/auth";



export class UserController {
  private readonly breweryApiUrl = config.breweryApiUrl;
  // Register user
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { name, email, password } = req.body;
      const response = await axios.post(`${this.breweryApiUrl}/api/auth/Register`, {
        name,
        email,
        password,
      });
      res.status(201).json(response.data);
    } catch (error: any) {
      console.error("Error registering user", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ message: error.response?.data?.message || "Error registering user" });
    }
  }

  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    try {
      const { email, password } = req.body;
      const response = await axios.post(`${this.breweryApiUrl}/api/auth/Login`, {
        email,
        password,
      });
      res.status(200).json(response.data);
    } catch (error: any) {
      console.error("Error logging in user", error.response?.data || error.message);
      res.status(error.response?.status || 500).json({ message: error.response?.data?.message || "Error logging in" });
    }
  }

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
