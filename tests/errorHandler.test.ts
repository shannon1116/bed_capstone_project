import { Request, Response } from "express";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import {
    AuthenticationError,
    AuthorizationError,
} from "../src/api/v1/errors/errors";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("errorHandler middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });

        mockRequest = {};
        mockResponse = {
            status: statusMock,
        };
        nextFunction = jest.fn();
    });

    it("should handle AuthenticationError with correct status and message", () => {
        const error = new AuthenticationError("Invalid token", "TOKEN_INVALID");

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
        expect(jsonMock).toHaveBeenCalledWith({
            status: "error",
            error: "Invalid token",
            code: "TOKEN_INVALID",
        });
    });

    it("should handle AuthorizationError with correct status and message", () => {
        const error = new AuthorizationError(
            "Insufficient permissions",
            "INSUFFICIENT_ROLE"
        );

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.FORBIDDEN);
        expect(jsonMock).toHaveBeenCalledWith({
            status: "error",
            error: "Insufficient permissions",
            code: "INSUFFICIENT_ROLE",
        });
    });

    it("should handle generic Error with 500 status", () => {
        const error = new Error("Unexpected error");

        errorHandler(
            error,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
        expect(jsonMock).toHaveBeenCalledWith({
            status: "error",
            error: "An unexpected error occurred",
            code: "UNKNOWN_ERROR",
        });
    });

    it("should handle null error gracefully", () => {
        errorHandler(
            null,
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(statusMock).toHaveBeenCalledWith(
            HTTP_STATUS.INTERNAL_SERVER_ERROR
        );
        expect(jsonMock).toHaveBeenCalledWith({
            status: "error",
            error: "An unexpected error occurred",
            code: "UNKNOWN_ERROR",
        });
    });

});