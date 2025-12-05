import request from "supertest";
import { Request, Response, NextFunction } from "express";
import app from "../src/app";
import * as voiceActorController from "../src/api/v1/controllers/voiceActorController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/voiceActorController", () => ({
    createVoiceActor: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllVoiceActors: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getOneVoiceActor: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    updateVoiceActor: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteVoiceActor: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

// Mocking authentication, essentially bypassing the actual authentication process by calling next()
jest.mock("../src/api/v1/middleware/authenticate", () => {
    return jest.fn((_req: Request, _res: Response, next: NextFunction) =>
        next()
    );
});

// Mocking authorization, essentially bypassing the actual authentication process by calling next() and passing empty _options
jest.mock("../src/api/v1/middleware/authorize", () => {
    return jest.fn(
        (_mockOptions) => (_req: Request, _res: Response, next: NextFunction) =>
            next()
    );
});

describe("Voice Actor Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/voiceActors/", () => {
        it("should call getAllVoiceActors controller", async () => {
            await request(app)
            .get("/api/v1/voiceActors")
            .query({
                id: "Test ID",
                name: "Test Voice Actor",
                characters: ["Test Character"],
            });
        });
    });

    describe("GET /api/v1/voiceActors/:id", () => {
        it("should call getOneVoiceActor controller", async () => {
          await request(app).get("/api/v1/voiceActors/testId");
          expect(voiceActorController.getOneVoiceActor).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/voiceActors/", () => {
        it("should call createVoiceActor controller with valid data", async () => {
            const mockVoiceActor = {
                id: "Test ID",
                name: "Test Voice Actor",
                characters: ["Test Character"],
            }; 

            await request(app).post("/api/v1/voiceActors/").send(mockVoiceActor);
            expect(voiceActorController.createVoiceActor).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/voiceActors/:id", () => {
        it("should call updateVoiceActor controller with valid data", async () => {
            const mockVoiceActor = {
                name: "Updated Name",
                characters: ["Updated Character"],
            }; 

            await request(app).put("/api/v1/voiceActors/testId").send(mockVoiceActor);
            expect(voiceActorController.updateVoiceActor).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/voiceActors/:id", () => {
        it("should call deleteVoiceActor controller with valid data", async () => {
            await request(app).delete("/api/v1/voiceActors/testId");
            expect(voiceActorController.deleteVoiceActor).toHaveBeenCalled();
        });
    });

})