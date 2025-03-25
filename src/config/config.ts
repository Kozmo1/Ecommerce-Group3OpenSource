import dotenv from "dotenv-safe";

dotenv.config({
	allowEmptyValues: true,
	path: `.env.${process.env.NODE_ENV || "local"}`,
	example: ".env.example",
});

const ENVIRONMENT = process.env.NODE_ENV ?? "development";
const JWT_SECRET = process.env.JWT_SECRET ?? "default-secret";
const BREWERY_API_URL = process.env.BREWERY_API_URL ?? "http://localhost:5089";
const PORT = process.env.PORT ?? "3000";

export interface Config {
	environment: string;
	jwtSecret: string;
	breweryApiUrl: string;
	port: string;
}

export const config: Config = {
	environment: ENVIRONMENT,
	jwtSecret: JWT_SECRET,
	breweryApiUrl: BREWERY_API_URL,
	port: PORT,
};
