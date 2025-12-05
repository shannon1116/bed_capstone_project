import { Request, Response } from "express";
import authenticate from "../src/api/v1/middleware/authenticate";
import { auth } from "../config/firebaseConfig";
import { AuthenticationError } from "../src/api/v1/errors/errors";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        verifyIdToken: jest.fn(),
    },
}));

describe("Authentication Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();

        mockRequest = { headers: {} } as Partial<Request>;
        mockResponse = {
            locals: {},
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        } as unknown as Partial<Response>;

        nextFunction = jest.fn();
    });

    it("should pass AuthenticationError to next() when no token is provided", async () => {
        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
        const error = nextFunction.mock.calls[0][0];
        expect(error.message).toBe("Unauthorized: No token provided");
        expect(error.code).toBe("TOKEN_NOT_FOUND");
        expect(error.statusCode).toBe(401);
    });
    
    it("should pass AuthenticationError to next() when token verification fails", async () => {
        mockRequest.headers = {
            authorization: "Bearer invalid-token",
        };

        (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(
            new Error("Invalid token")
        );

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(nextFunction).toHaveBeenCalledWith(
            expect.any(AuthenticationError)
        );
    });

    it("should call next() and set user data when token is valid", async () => {
        mockRequest.headers = {
            authorization: "Bearer valid-token",
        };

        (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
            uid: "user1",
            role: "manager",
        });

        await authenticate(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        expect(auth.verifyIdToken).toHaveBeenCalledWith("valid-token");
        expect(mockResponse.locals).toEqual({
            uid: "user1",
            role: "manager",
        });

        expect(nextFunction).toHaveBeenCalledWith();
    });

});