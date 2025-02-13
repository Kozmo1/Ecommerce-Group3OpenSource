import dotenv from "dotenv-safe";

dotenv.config({allowEmptyValues: true, path: `.env.${process.env.NODE_ENV}`}); // Load environment variables from .env file

const ENVIRONMENT = process.env.NODE_ENV ?? "development"; // Set the environment to development if not specified
const MONGO_HOST = process.env.MONGO_HOST ?? ""; // Get the MongoDB host from the environment variables
const MONGO_DATABASE = process.env.MONGO_DATABASE ?? ""; // Get the MongoDB database from the environment variables
const MONGO_PORT = process.env.MONGO_PASSWORD ?? ""; // Get the MongoDB port from the environment variables
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`; // Create the MongoDB URL

export const config = { // Export the configuration object
    environment: ENVIRONMENT,
    mongo: {
        url: MONGO_URL
    }
};