import dotenv from "dotenv-safe";

// Load environment variables from .env file based on NODE_ENV or default to .env.local
dotenv.config({
	allowEmptyValues: true,
	path: `.env.${process.env.NODE_ENV || "local"}`,
	example: ".env.example",
});

// Set the environment to development if not specified
const ENVIRONMENT = process.env.NODE_ENV ?? "development";

// Set the JWT secret (used for token verification in Node.js)
const JWT_SECRET = process.env.JWT_SECRET ?? "";

// Set the Brewery_DB_Service API URL
const BREWERY_API_URL = process.env.BREWERY_API_URL ?? "http://localhost:5089";

export interface Config {
	environment: string;
	jwtSecret: string;
	breweryApiUrl: string;
}

export const config: Config = {
	environment: ENVIRONMENT,
	jwtSecret: JWT_SECRET,
	breweryApiUrl: BREWERY_API_URL,
};
