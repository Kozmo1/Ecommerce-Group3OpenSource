import { Request, Response, NextFunction } from "express";
import axios from "axios";
import { validationResult } from "express-validator";
import { config } from "../config/config";
import { AuthRequest } from "../middleware/auth";

// Define response types for clarity
interface AuthResponse {
	id: string;
	email: string;
}

interface LoginResponse {
	token: string;
}

interface UserResponse {
	id: string;
	email: string;
	name: string;
	tasteProfile: {
		primaryFlavor?: string;
		sweetness?: string;
		bitterness?: string;
	} | null;
}

interface TasteProfileResponse {
	tasteProfile: {
		primaryFlavor?: string;
		sweetness?: string;
		bitterness?: string;
	};
}

export class UserController {
	private readonly breweryApiUrl = config.breweryApiUrl;

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
			const response = await axios.post<AuthResponse>(
				`${this.breweryApiUrl}/api/auth/register`,
				req.body
			);
			res.status(201).json(response.data); // { id, email }
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
			const response = await axios.post<LoginResponse>(
				`${this.breweryApiUrl}/api/auth/login`,
				req.body
			);
			res.status(200).json(response.data); // { token }
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
			const response = await axios.get<UserResponse>(
				`${this.breweryApiUrl}/api/auth/${req.params.id}`
			);
			if (req.user?.id !== response.data.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			res.status(200).json(response.data); // { id, email, name, tasteProfile }
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

	public logout(req: Request, res: Response, next: NextFunction): void {
		// Since JWT is stateless, logout is client-side (discard token)
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
			const response = await axios.put<TasteProfileResponse>(
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
			res.status(200).json(response.data); // Assuming array of orders
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
