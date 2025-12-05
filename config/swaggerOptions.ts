import swaggerJsdoc from "swagger-jsdoc";
import dotenv from "dotenv";

// Make sure environment variables are loaded
dotenv.config();

// Get the server URL from environment variables or use a default
const serverUrl =
    process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api/v1";

const swaggerOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Back-End Development Capstone Project API Documentation",
            version: "1.0.0",
            description:
                "This is the API documentation for the Back-End Development Capstone Project.",
        },
        servers: [
            {
                url: serverUrl,
                description:
                    process.env.NODE_ENV === "production"
                        ? "Production server for Back-End Development Capstone Project"
                        : "Local server for Back-End Development Capstone Project",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/api/v1/routes/*.ts",
        "./src/api/v1/controllers/*.ts",
        "./src/api/v1/validations/*.ts",
    ], // Path to the API docs and schemas
};

// Generate the Swagger spec
export const generateSwaggerSpec = (): object => {
    return swaggerJsdoc(swaggerOptions);
};