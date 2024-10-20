import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import professorsRoutes from "./routes/professors.routes.js"
import { FRONTEND_URL } from "./config.js";

/**
 * Initializes an Express application.
 * 
 * @constant {Object} app - The Express application instance.
 */
const app = express();

app.use(
    cors({
        credentials: true,
        origin: FRONTEND_URL,
    })
);

app.use(express.json());

app.use(morgan('dev'));

app.use(cookieParser())

app.use('/api/auth', authRoutes);

app.use('/api/professors', professorsRoutes);

export default app;