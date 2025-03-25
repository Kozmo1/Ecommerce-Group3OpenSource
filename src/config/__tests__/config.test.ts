import { config } from "../../config/config";

// Mock dotenv-safe to control environment loading
jest.mock("dotenv-safe", () => ({
	config: jest.fn((options) => {
		// Simulate no .env file loaded for fallback test
		if (!options.path || options.path.includes("nonexistent")) {
			return { parsed: {} }; // Empty parsed object
		}
		// For other tests, let it proceed normally (though we'll override process.env)
		return { parsed: process.env };
	}),
}));

describe("config", () => {
	beforeEach(() => {
		jest.resetModules(); // Reset module cache before each test
	});

	it("should use fallback values if environment variables are not set", () => {
		const originalEnv = { ...process.env };
		// Ensure no residual env vars
		delete process.env.PORT;
		delete process.env.JWT_SECRET;
		delete process.env.BREWERY_API_URL;
		delete process.env.NODE_ENV;

		const { config } = require("../../config/config");

		console.log("Test 1 - process.env.PORT:", process.env.PORT);
		console.log("Test 1 - config.port:", config.port);
		console.log("Test 1 - process.env.JWT_SECRET:", process.env.JWT_SECRET);
		console.log("Test 1 - config.jwtSecret:", config.jwtSecret);

		expect(config.port).toBe("3000");
		expect(config.jwtSecret).toBe("default-secret");
		expect(config.breweryApiUrl).toBe("http://localhost:5089");
		expect(config.environment).toBe("development");

		process.env = originalEnv;
	});

	it("should use environment variables when they are set", () => {
		const originalEnv = { ...process.env };
		process.env.PORT = "4000";
		process.env.JWT_SECRET = "my-secret";
		process.env.BREWERY_API_URL = "https://api.example.com";
		process.env.NODE_ENV = "production";

		const { config } = require("../../config/config");

		expect(config.port).toBe("4000");
		expect(config.jwtSecret).toBe("my-secret");
		expect(config.breweryApiUrl).toBe("https://api.example.com");
		expect(config.environment).toBe("production");

		process.env = originalEnv;
	});

	it("should handle missing .env file gracefully", () => {
		const originalEnv = { ...process.env };
		process.env.NODE_ENV = "nonexistent";
		delete process.env.PORT;
		delete process.env.JWT_SECRET;
		delete process.env.BREWERY_API_URL;

		const { config } = require("../../config/config");

		console.log("Test 3 - process.env.PORT:", process.env.PORT);
		console.log("Test 3 - config.port:", config.port);
		console.log("Test 3 - process.env.JWT_SECRET:", process.env.JWT_SECRET);
		console.log("Test 3 - config.jwtSecret:", config.jwtSecret);

		expect(config.environment).toBe("nonexistent");
		expect(config.port).toBe("3000");
		expect(config.jwtSecret).toBe("default-secret");
		expect(config.breweryApiUrl).toBe("http://localhost:5089");

		process.env = originalEnv;
	});
});
