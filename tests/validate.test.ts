import { Request, Response, NextFunction } from "express";
import { validateRequest } from "../src/api/v1/middleware/validate";
import { songSchemas } from "../src/api/v1/validations/songValidation";
import { episodeSchemas } from "../src/api/v1/validations/episodeValidation";
import { voiceActorSchemas } from "../src/api/v1/validations/voiceActorValidation";
import { MiddlewareFunction } from "../src/api/v1/types/express";
import { HTTP_STATUS } from "../src/constants/httpConstants";

describe("Song Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid song data", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            title: "Valid Title",
            composers: ["Valid Composer 1", "Valid Composer 2"],
            characters: ["Valid Character 1", "Valid Character 2"],
            time: "Valid Time",
            episodeId: "Valid Episode ID",
        };
        const middleware: MiddlewareFunction = validateRequest(songSchemas.create);

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when title is empty string", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            title: "",
            composers: ["Valid Composer 1", "Valid Composer 2"],
            characters: ["Valid Character 1", "Valid Character 2"],
            time: "Valid Time",
            episodeId: "Valid Episode ID",
        };
        const middleware: MiddlewareFunction = validateRequest(songSchemas.create);

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Title cannot be empty",
        });
    });
});


describe("Episode Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid episode data", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            title: "Valid Title",
            airdate: "Valid Airdate",
            season: "Valid Season",
            episode: "Valid Episode",
            director: "Valid Director",
            writers: ["Valid Writer 1", "Valid Writer 2"],
        };
        const middleware: MiddlewareFunction = validateRequest(
            episodeSchemas.create
        );

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when title is empty string", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            title: "",
            airdate: "Valid Airdate",
            season: "Valid Season",
            episode: "Valid Episode",
            director: "Valid Director",
            writers: ["Valid Writer 1", "Valid Writer 2"],
        };
        const middleware: MiddlewareFunction = validateRequest(
            episodeSchemas.create
        );

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Title cannot be empty",
        });
    });
});

describe("Voice Actor Validation Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockReq = {
            body: {},
            params: {},
            query: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should pass validation for valid voice actor data", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            name: "Valid Name",
            characters: ["Valid Character 1", "Valid Character 2"],
        };
        const middleware: MiddlewareFunction = validateRequest(
            voiceActorSchemas.create
        );

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it("should fail validation when name is empty string", async () => {
        // Arrange
        mockReq.body = {
            id: "Valid ID",
            title: "",
            characters: ["Valid Character 1", "Valid Character 2"],
        };
        const middleware: MiddlewareFunction = validateRequest(
            voiceActorSchemas.create
        );

        // Act
        await middleware(mockReq as Request, mockRes as Response, mockNext);

        // Assert
        expect(mockNext).not.toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        expect(mockRes.json).toHaveBeenCalledWith({
            error: "Validation error: Body: Name is required",
        });
    });
});