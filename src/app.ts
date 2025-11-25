// import the express application and type definition
import express, { Express } from "express";
// import setupSwagger from "../config/swagger";
// import dotenv from "dotenv";

// dotenv.config();

import songRoutes from "./api/v1/routes/songRoutes";
import episodeRoutes from "./api/v1/routes/episodeRoutes";
import voiceActorRoutes from "./api/v1/routes/voiceActorRoutes";

// initialize the express application
const app: Express = express();

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

// Route Imports END

// setupSwagger(app);

// export app and server for testing
export default app;