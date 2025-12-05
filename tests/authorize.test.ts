import { Request, Response } from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationError } from "../src/api/v1/errors/errors";

describe("isAuthorized middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        mockRequest = {
            params: {},
        };
        mockResponse = {
            locals: {},
        };
        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        mockResponse.locals = {
            uid: "user2",
            role: "user",
        };

        const middleware = isAuthorized({ hasRole: ["admin", "editor", "user"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should pass AuthorizationError to next() when user has insufficient role", () => {
        mockResponse.locals = {
            uid: "user2",
            role: "officer",
        };

        const middleware = isAuthorized({ hasRole: ["admin", "editor", "user"] });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthorizationError)
        );
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Forbidden: Insufficient role");
        expect(error.code).toBe("INSUFFICIENT_ROLE");
        expect(error.statusCode).toBe(403);
    });

    it("should call next() when same user and allowSameUser is true", () => {
        mockRequest.params = { id: "user23" };

        mockResponse.locals = {
            uid: "user23",
            role: "officer",
        };

        const middleware = isAuthorized({
            hasRole: ["editor"],
            allowSameUser: true,
        });

        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith();
    });

});