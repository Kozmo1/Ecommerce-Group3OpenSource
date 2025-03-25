import { UserController } from "../userController";
import { Request, Response } from "express";
import { AuthRequest } from "../../middleware/auth";
import axios from "axios";
import { validationResult, ValidationError } from "express-validator";

// Mock axios
jest.mock("axios", () => ({
	post: jest.fn(),
	get: jest.fn(),
	put: jest.fn(),
}));

// Mock express-validator
jest.mock("express-validator", () => ({
	validationResult: jest.fn(), // Mocked as a function
}));

// Type the mocked validationResult explicitly
const mockedValidationResult =
	validationResult as unknown as jest.MockedFunction<
		() => {
			isEmpty: () => boolean;
			array: () => ValidationError[];
		}
	>;

describe("UserController", () => {
	let userController: UserController;
	let mockRequest: Partial<AuthRequest>;
	let mockResponse: Partial<Response>;
	let mockNext: jest.Mock;

	beforeEach(() => {
		userController = new UserController();
		mockRequest = {
			body: {},
			params: {},
			headers: {},
			user: undefined,
		};
		mockResponse = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn(),
		};
		mockNext = jest.fn();

		jest.clearAllMocks(); // Clear mocks before each test
		jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console.error
	});

	describe("register", () => {
		it("should register a user successfully", async () => {
			const mockUser = { id: "1", email: "test@example.com" };
			(axios.post as jest.Mock).mockResolvedValue({ data: mockUser });
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			await userController.register(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(axios.post).toHaveBeenCalledWith(
				"http://localhost:5089/api/auth/register",
				mockRequest.body
			);
			expect(mockResponse.status).toHaveBeenCalledWith(201);
			expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
		});

		it("should return 400 if validation fails", async () => {
			mockRequest.body = { email: "invalid", password: "" };
			mockedValidationResult.mockReturnValue({
				isEmpty: () => false,
				array: () => [
					{ msg: "Invalid email format" } as ValidationError,
				],
			});

			await userController.register(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: [{ msg: "Invalid email format" }],
			});
		});

		it("should handle registration errors", async () => {
			const errorResponse = {
				response: {
					status: 500,
					data: { message: "Server error", errors: "Server error" },
				},
			};
			(axios.post as jest.Mock).mockRejectedValue(errorResponse);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			await userController.register(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Server error",
				error: "Server error",
			});
		});

		it("should handle registration errors without response", async () => {
			const error = new Error("Network error");
			(axios.post as jest.Mock).mockRejectedValue(error);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
				name: "Test User",
			};

			await userController.register(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error registering user",
				error: "Network error",
			});
		});
	});

	describe("login", () => {
		it("should login a user successfully", async () => {
			const mockToken = { token: "mock-jwt-token" };
			(axios.post as jest.Mock).mockResolvedValue({ data: mockToken });
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
			};

			await userController.login(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(axios.post).toHaveBeenCalledWith(
				"http://localhost:5089/api/auth/login",
				mockRequest.body
			);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockToken);
		});
		it("should handle login errors with non-401 status", async () => {
			const errorResponse = {
				response: { status: 500, data: { message: "Server error" } },
			};
			(axios.post as jest.Mock).mockRejectedValue(errorResponse);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
			};

			await userController.login(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Server error",
				error: undefined,
			});
		});

		it("should return 400 if validation fails", async () => {
			mockRequest.body = { email: "invalid", password: "" };
			mockedValidationResult.mockReturnValue({
				isEmpty: () => false,
				array: () => [
					{ msg: "Invalid email format" } as ValidationError,
				],
			});

			await userController.login(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: [{ msg: "Invalid email format" }],
			});
		});

		it("should return 401 on invalid credentials", async () => {
			const errorResponse = {
				response: {
					status: 401,
					data: {
						message: "Invalid credentials",
						errors: "Invalid credentials",
					},
				},
			};
			(axios.post as jest.Mock).mockRejectedValue(errorResponse);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			await userController.login(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Invalid credentials",
				error: "Invalid credentials",
			});
		});

		it("should handle login errors without response", async () => {
			const error = new Error("Network error");
			(axios.post as jest.Mock).mockRejectedValue(error);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.body = {
				email: "test@example.com",
				password: "password123",
			};

			await userController.login(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(401);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Invalid credentials",
				error: "Network error",
			});
		});
	});

	describe("getUserById", () => {
		it("should get user by ID successfully", async () => {
			const mockUser = {
				id: "1",
				email: "test@example.com",
				name: "Test User",
				tasteProfile: { primaryFlavor: "Hoppy" },
			};
			(axios.get as jest.Mock).mockResolvedValue({ data: mockUser });

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserById(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(axios.get).toHaveBeenCalledWith(
				"http://localhost:5089/api/auth/1"
			);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
		});

		it("should return 403 if user is unauthorized", async () => {
			const mockUser = {
				id: "2",
				email: "other@example.com",
				name: "Other User",
				tasteProfile: null,
			};
			(axios.get as jest.Mock).mockResolvedValue({ data: mockUser });

			mockRequest.params = { id: "2" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserById(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should handle user not found", async () => {
			const errorResponse = {
				response: {
					status: 404,
					data: {
						message: "User not found",
						errors: "User not found",
					},
				},
			};
			(axios.get as jest.Mock).mockRejectedValue(errorResponse);

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserById(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "User not found",
				error: "User not found",
			});
		});

		it("should return 403 if req.user is undefined", async () => {
			mockRequest.params = { id: "1" };
			mockRequest.user = undefined;

			await userController.getUserById(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should handle errors without response", async () => {
			const error = new Error("Network error");
			(axios.get as jest.Mock).mockRejectedValue(error);

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserById(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(404);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "User not found",
				error: "Network error",
			});
		});
	});

	describe("logout", () => {
		it("should logout successfully", () => {
			userController.logout(
				mockRequest as Request,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "User logged out successfully",
			});
		});
	});

	describe("updateTasteProfile", () => {
		it("should update taste profile successfully", async () => {
			const mockTasteProfile = {
				tasteProfile: {
					primaryFlavor: "Hoppy",
					sweetness: "Low",
					bitterness: "High",
				},
			};
			(axios.put as jest.Mock).mockResolvedValue({
				data: mockTasteProfile,
			});
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };
			mockRequest.body = {
				tasteProfile: {
					primaryFlavor: "Hoppy",
					sweetness: "Low",
					bitterness: "High",
				},
			};

			await userController.updateTasteProfile(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(axios.put).toHaveBeenCalledWith(
				"http://localhost:5089/api/auth/1/taste-profile",
				mockRequest.body
			);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Taste profile updated successfully",
				tasteProfile: mockTasteProfile.tasteProfile,
			});
		});

		it("should return 400 if validation fails", async () => {
			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };
			mockRequest.body = { tasteProfile: null };
			mockedValidationResult.mockReturnValue({
				isEmpty: () => false,
				array: () => [
					{ msg: "Taste profile is required" } as ValidationError,
				],
			});

			await userController.updateTasteProfile(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				errors: [{ msg: "Taste profile is required" }],
			});
		});

		it("should return 403 if user is unauthorized", async () => {
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.params = { id: "2" };
			mockRequest.user = { id: "1", email: "test@example.com" };
			mockRequest.body = { tasteProfile: { primaryFlavor: "Hoppy" } };

			await userController.updateTasteProfile(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should return 403 if req.user is undefined", async () => {
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.params = { id: "1" };
			mockRequest.user = undefined;
			mockRequest.body = { tasteProfile: { primaryFlavor: "Hoppy" } };

			await userController.updateTasteProfile(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should handle errors without response", async () => {
			const error = new Error("Network error");
			(axios.put as jest.Mock).mockRejectedValue(error);
			mockedValidationResult.mockReturnValue({
				isEmpty: () => true,
				array: () => [],
			});

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };
			mockRequest.body = { tasteProfile: { primaryFlavor: "Hoppy" } };

			await userController.updateTasteProfile(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error updating taste profile",
				error: "Network error",
			});
		});
	});

	describe("getUserOrders", () => {
		it("should get user orders successfully", async () => {
			const mockOrders = [
				{ id: "1", userId: "1", totalPrice: 11.98, status: "Shipped" },
			];
			(axios.get as jest.Mock).mockResolvedValue({ data: mockOrders });

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(axios.get).toHaveBeenCalledWith(
				"http://localhost:5089/api/order/user/1"
			);
			expect(mockResponse.status).toHaveBeenCalledWith(200);
			expect(mockResponse.json).toHaveBeenCalledWith(mockOrders);
		});

		it("should handle errors when fetching user orders", async () => {
			const errorResponse = {
				response: {
					status: 500,
					data: { message: "Server error", errors: "Server error" },
				},
			};
			(axios.get as jest.Mock).mockRejectedValue(errorResponse);

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Server error",
				error: "Server error",
			});
		});

		it("should handle errors with partial response data", async () => {
			const errorResponse = { response: { status: 400, data: {} } };
			(axios.get as jest.Mock).mockRejectedValue(errorResponse);

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(400);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error fetching orders",
				error: undefined,
			});
		});

		it("should return 403 if user is unauthorized", async () => {
			mockRequest.params = { id: "2" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should return 403 if req.user is undefined", async () => {
			mockRequest.params = { id: "1" };
			mockRequest.user = undefined;

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(403);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Unauthorized",
			});
		});

		it("should handle errors without response object", async () => {
			const error = new Error("Network error");
			(axios.get as jest.Mock).mockRejectedValue(error);

			mockRequest.params = { id: "1" };
			mockRequest.user = { id: "1", email: "test@example.com" };

			await userController.getUserOrders(
				mockRequest as AuthRequest,
				mockResponse as Response,
				mockNext
			);

			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.json).toHaveBeenCalledWith({
				message: "Error fetching orders",
				error: "Network error",
			});
		});
	});
});
