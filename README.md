# Ecommerce-Group3OpenSource

Created by Joel Attard, Shahyar Fida, Mike Kraemer, Julia Lebedzeva

This project is a Node.js-based microservice for user management in an e-commerce application, developed as part of a group project for Open Source Web Programming at Conestoga College. It handles user registration, login, profile management, and order retrieval, integrating with a Brewery Database Service via RESTful APIs. Built with TypeScript, Express, and Jest for testing, it emphasizes modularity, security, and testability with over 90% branch coverage. The service uses `dotenv-safe` to manage environment variables, loading them from `.env.local` by default or a file specified by `NODE_ENV`. Key configurations include the server port (default: 3000), JWT secret for authentication, and the Brewery API URL (default: http://localhost:5089). The `UserController` class manages core functionality, leveraging Axios for HTTP requests and express-validator for input validation.

To install, clone the repository from `C:\git\Ecommerce-Group3OpenSource` (or your forked version), then run `npm install` to set up dependencies like `express`, `axios`, `jsonwebtoken`, `dotenv-safe`, and `express-validator`. For development, install `typescript`, `jest`, `@types/*` packages, and `ts-node` via `npm install --save-dev`. Create a `.env.local` file with `PORT`, `JWT_SECRET`, `BREWERY_API_URL`, and `NODE_ENV` as needed, using `.env.example` as a template. Run the service with `npm start` (assumes a `start` script like `ts-node src/index.ts`), or use `npm run build` to compile TypeScript to JavaScript and `node dist/index.js` to execute. For testing, execute `npm run test` to run Jest with coverage reporting, targeting 100% statement/branch/function/line coverage.

The project structure includes `src/config/config.ts` for environment setup, `src/controllers/userController.ts` for business logic, `src/middleware/auth.ts` for JWT verification, and `src/index.ts` as the entry point. Tests reside in `src/config/__tests__/config.test.ts` and `src/controllers/__tests__/userController.test.ts`, mocking dependencies like Axios and express-validator.

Key endpoints are detailed below, all prefixed with `/user` and requiring JSON content type unless noted. Authentication uses a Bearer token in the `Authorization` header for protected routes.

1. `POST /register` - Registers a new user. Example input: `{"name": "John Doe", "email": "john@example.com", "password": "secure123"}`. Success response (201): `{"id": "1", "email": "john@example.com"}`. Error (400): `{"errors": [{"msg": "Invalid email format"}]}`.

2. `POST /login` - Authenticates a user and returns a JWT. Example input: `{"email": "john@example.com", "password": "secure123"}`. Success response (200): `{"token": "eyJhbGciOiJIUzI1Ni..."}`. Error (401): `{"message": "Invalid credentials"}`.

3. `GET /:id` - Fetches user details (authenticated). Example request: `GET /user/1` with header `Authorization: Bearer <token>`. Success response (200): `{"id": "1", "email": "john@example.com", "name": "John Doe", "tasteProfile": null}`. Error (403): `{"message": "Unauthorized"}`.

4. `PUT /:id/taste-profile` - Updates user taste profile (authenticated). Example input: `{"tasteProfile": {"primaryFlavor": "Hoppy", "sweetness": "Low"}}` with header `Authorization: Bearer <token>`. Success response (200): `{"message": "Taste profile updated successfully", "tasteProfile": {"primaryFlavor": "Hoppy", "sweetness": "Low"}}`. Error (400): `{"errors": [{"msg": "Primary flavor must be a string"}]}`.

5. `GET /:id/orders` - Retrieves user orders (authenticated). Example request: `GET /user/1/orders` with header `Authorization: Bearer <token>`. Success response (200): `[{"id": "1", "userId": "1", "totalPrice": 11.98, "status": "Shipped"}]`. Error (403): `{"message": "Unauthorized"}`.

6. `POST /logout` - Logs out by instructing client to discard token (no server-side state). Example input: `{}`. Success response (200): `{"message": "User logged out successfully"}`.
