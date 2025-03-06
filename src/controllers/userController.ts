import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { validationResult } from "express-validator";
import { config } from "../config/config";
import { AuthRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";

export class UserController {
	private readonly breweryApiUrl = config.breweryApiUrl;
	private readonly jwtSecret = config.jwtSecret;
	// Register user
	public async register(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		try {
			const response = await axios.post<{ id: string; email: string }>(
				`${this.breweryApiUrl}/api/auth/register`,
				req.body
			);
			const token = jwt.sign(
				{
					id: (response.data as { id: string; email: string }).id,
					email: (response.data as { id: string; email: string })
						.email,
				},
				this.jwtSecret,
				{ expiresIn: "1h" }
			);
			res.status(201).json({ token });
		} catch (error: any) {
			console.error(
				"Error registering user:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error registering user",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async login(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			const response = await axios.post<{ id: string; email: string }>(
				`${this.breweryApiUrl}/api/auth/login`,
				req.body
			);
			const token = jwt.sign(
				{ id: response.data.id, email: response.data.email },
				this.jwtSecret,
				{ expiresIn: "1h" }
			);
			res.status(200).json({ token });
		} catch (error: any) {
			console.error(
				"Error logging in:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 401).json({
				message: error.response?.data?.message || "Invalid credentials",
				error: error.response?.data?.errors || error.message,
			});
		}
	}
	async getUserById(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const response = await axios.get<{ id: string }>(
				`${this.breweryApiUrl}/api/auth/${req.params.id}`
			);
			if (req.user?.id !== response.data.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			res.status(200).json(response.data);
		} catch (error: any) {
			console.error(
				"Error fetching user:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 404).json({
				message: error.response?.data?.message || "User not found",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	// Logout user
	public logout(req: Request, res: Response, next: NextFunction) {
		res.status(200).json({ message: "User logged out successfully" });
	}
	async updateTasteProfile(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			const response = await axios.put<{ tasteProfile: any }>(
				`${this.breweryApiUrl}/api/auth/${req.params.id}/taste-profile`,
				req.body
			);
			if (req.user?.id !== req.params.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			res.status(200).json({
				message: "Taste profile updated successfully",
				tasteProfile: response.data.tasteProfile,
			});
		} catch (error: any) {
			console.error(
				"Error updating taste profile:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message ||
					"Error updating taste profile",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	async getUserOrders(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			if (req.user?.id !== req.params.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			const response = await axios.get(
				`${this.breweryApiUrl}/api/order/user/${req.params.id}`
			);
			res.status(200).json(response.data);
		} catch (error: any) {
			console.error(
				"Error fetching user orders:",
				error.response?.data || error.message
			);
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error fetching orders",
				error: error.response?.data?.errors || error.message,
			});
		}
	}
}
