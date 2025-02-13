import express from 'express';
import cors from 'cors';
import dotenv from "dotenv-safe";
import userRoutes from "./ports/rest/routes/user";


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

dotenv.config();

const port = process.env.PORT || 3000;

app.use("/healthcheck", (req, res) => {
    res.status(200).send("Server is running");
});

app.use("/user", userRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});