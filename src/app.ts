// import the express application and type definition
import express, { Express } from "express";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";
import errorHandler from "./api/v1/middleware/errorHandler";
// import setupSwagger from "../config/swagger";
// import dotenv from "dotenv";

// dotenv.config();

import songRoutes from "./api/v1/routes/songRoutes";
import episodeRoutes from "./api/v1/routes/episodeRoutes";
import voiceActorRoutes from "./api/v1/routes/voiceActorRoutes";
import userRoutes from "./api/v1/routes/userRoutes";

// initialize the express application
const app: Express = express();

// Logging middleware (should be applied early in the middleware stack)
if (process.env.NODE_ENV === "production") {
    // In production, log to files
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    // In development, log to console for immediate feedback
    app.use(consoleLogger);
}

// Interface for health check response
// An interface in TypeScript defines the structure or "shape" of an object.
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}

app.use(express.json());

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello, world!");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

// Route Imports START
app.use("/api/v1/songs", songRoutes);
app.use("/api/v1/episodes", episodeRoutes);
app.use("/api/v1/voiceActors", voiceActorRoutes);
app.use("/api/v1/users", userRoutes);

// Route Imports END

// Global error handling middleware (MUST be applied last)
app.use(errorHandler);

// setupSwagger(app);

// export app and server for testing
export default app;