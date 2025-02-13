"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_safe_1 = __importDefault(require("dotenv-safe"));
const user_1 = __importDefault(require("./ports/rest/routes/user"));
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
dotenv_safe_1.default.config();
const port = process.env.PORT || 3000;
app.use("/healthcheck", (req, res) => {
    res.status(200).send("Server is running");
});
app.use("/user", user_1.default);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
