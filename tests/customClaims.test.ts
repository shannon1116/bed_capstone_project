import { Request, Response, NextFunction } from "express";
import { setCustomClaims } from "../src/api/v1/controllers/adminController";
import { getUserDetails } from "../src/api/v1/controllers/userController";
import { auth } from "../config/firebaseConfig";
import { successResponse } from "../src/api/v1/models/responseModel";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../config/firebaseConfig", () => ({
    auth: {
        setCustomUserClaims: jest.fn(),
        getUser: jest.fn(),
    }
}));

jest.mock("../src/api/v1/models/responseModel", () => ({
    successResponse: jest.fn(),
}));

describe("Custom Claims Tests", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {
            body: { uid: "user1", roles: { manager: true } },
            params: { id: "user1" },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it("should set custom claims", async () => {
        (auth.getUser as jest.Mock).mockResolvedValueOnce({
            uid: "user1",
            customClaims: {},
        });

        (auth.setCustomUserClaims as jest.Mock).mockResolvedValueOnce(undefined);
        
        (successResponse as jest.Mock).mockReturnValue({
            success: true,
            message: "Custom claims set successfully",
        });

        await setCustomClaims(req as Request, res as Response, next);

        expect(auth.getUser).toHaveBeenCalledWith("user1");
        expect(auth.setCustomUserClaims).toHaveBeenCalledWith("user1", { manager: true });

        expect(res.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: "Custom claims set successfully",
        });
    });

    it("should retrieve custom claims", async () => {
        const mockUserRecord = {
            uid: "user1",
            email: "test@example.com",
            customClaims: { roles: { manager: true} },
        };
        (auth.getUser as jest.Mock).mockResolvedValueOnce(mockUserRecord);
        (successResponse as jest.Mock).mockReturnValue({
            success: true,
            data: mockUserRecord,
        });

        await getUserDetails(req as Request, res as Response, next);
        
        expect(auth.getUser).toHaveBeenCalledWith("user1");
        expect(successResponse).toHaveBeenCalledWith(mockUserRecord);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: mockUserRecord,
        });
    });

    it("should handle errors when setting claims fails", async () => {
        const error = new Error("Firebase error");

        (auth.getUser as jest.Mock).mockResolvedValueOnce({
            uid: "user1",
            customClaims: {},
        });

        (auth.setCustomUserClaims as jest.Mock).mockRejectedValueOnce(error);

        await setCustomClaims(req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});