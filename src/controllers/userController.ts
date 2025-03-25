import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import axios from "axios";
import { config } from "../config/config";
import { AuthRequest } from "../middleware/auth";

// I’m setting up some interfaces to keep my responses clear and tidy
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
	// Hey, I’m grabbing the Brewery API URL from my config—gonna need this for all my requests!
	private readonly breweryApiUrl = config.breweryApiUrl;

	// This is my register method—lets new users sign up, so cool!
	public async register(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		// First, I’m checking if there are any validation errors—like, did they mess up the email?
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			// Alright, I’m sending the user’s info to the Database Service to register them
			const response = await axios.post<AuthResponse>(
				`${this.breweryApiUrl}/api/auth/register`,
				req.body
			);
			// Sweet, it worked! Sending back the user’s ID and email with a 201 status
			res.status(201).json(response.data); // { id, email }
		} catch (error: any) {
			// Uh-oh, something broke! I’m logging the error so I can figure out what’s up
			console.error(
				"Error registering user:",
				error.response?.data || error.message
			);
			// Sending back an error message to the user—let’s be nice about it
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error registering user",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	// This is my login method—gotta let users in, right?
	async login(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		// Checking for validation errors again—gotta make sure the email and password are good
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			// Sending the login info to the Database Service to get a token
			const response = await axios.post<LoginResponse>(
				`${this.breweryApiUrl}/api/auth/login`,
				req.body
			);
			// Nice, they’re in! Sending back the token with a 200 status
			res.status(200).json(response.data); // { token }
		} catch (error: any) {
			// Oops, login didn’t work—maybe wrong password? Logging the error
			console.error(
				"Error logging in:",
				error.response?.data || error.message
			);
			// Telling the user something went wrong—probably invalid credentials
			res.status(error.response?.status || 401).json({
				message: error.response?.data?.message || "Invalid credentials",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	// This method grabs a user by their ID—super handy for getting user details
	async getUserById(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			// Check authorization first
			if (!req.user?.id || req.user.id !== req.params.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}

			const response = await axios.get<UserResponse>(
				`${this.breweryApiUrl}/api/auth/${req.params.id}`
			);
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

	// This is my logout method—pretty simple since JWT is stateless
	public logout(req: Request, res: Response, next: NextFunction): void {
		// I’m just telling the client to ditch the token on their end—easy peasy!
		res.status(200).json({ message: "User logged out successfully" });
	}

	// This method lets users update their taste profile—like, what kind of beer they love!
	async updateTasteProfile(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		// Checking for validation errors—gotta make sure the taste profile stuff is legit
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}

		try {
			// Sending the updated taste profile to the Database Service
			const response = await axios.put<TasteProfileResponse>(
				`${this.breweryApiUrl}/api/auth/${req.params.id}/taste-profile`,
				req.body
			);
			// Making sure the user can only update their own profile—safety first!
			if (req.user?.id !== req.params.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			// Awesome, it worked! Sending back a success message and the new taste profile
			res.status(200).json({
				message: "Taste profile updated successfully",
				tasteProfile: response.data.tasteProfile,
			});
		} catch (error: any) {
			// Uh-oh, something broke while updating—logging the error to see what’s up
			console.error(
				"Error updating taste profile:",
				error.response?.data || error.message
			);
			// Telling the user something went wrong—let’s keep it friendly
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message ||
					"Error updating taste profile",
				error: error.response?.data?.errors || error.message,
			});
		}
	}

	// This method grabs all the orders for a user—super useful for order history!
	async getUserOrders(
		req: AuthRequest,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			// Making sure the user can only see their own orders—gotta keep things secure
			if (req.user?.id !== req.params.id) {
				res.status(403).json({ message: "Unauthorized" });
				return;
			}
			// Asking the Database Service for the user’s orders
			const response = await axios.get(
				`${this.breweryApiUrl}/api/order/user/${req.params.id}`
			);
			// Got the orders! Sending them back with a 200 status
			res.status(200).json(response.data); // Assuming array of orders
		} catch (error: any) {
			// Something went wrong while fetching orders—logging the error
			console.error(
				"Error fetching user orders:",
				error.response?.data || error.message
			);
			// Letting the user know we couldn’t get their orders
			res.status(error.response?.status || 500).json({
				message:
					error.response?.data?.message || "Error fetching orders",
				error: error.response?.data?.errors || error.message,
			});
		}
	}
}
