import request from "supertest";
import app from "../src/app";
import * as songController from "../src/api/v1/controllers/songController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/songController", () => ({
    createSong: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllSongs: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getOneSong: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    updateSong: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteSong: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getSongsByEpisode: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getSongsByCharacter: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getVoiceActorsBySong: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Song Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/songs/", () => {
        it("should call getAllSongs controller", async () => {
            await request(app).get("/api/v1/songs")
            
            expect(songController.getAllSongs).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/songs/:id", () => {
        it("should call getOneSong controller", async () => {
            await request(app).get("/api/v1/songs/testId");

          expect(songController.getOneSong).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/songs/episode/:episodeId", () => {
        it("should call getSongsByEpisode controller", async () => {
            await request(app).get("/api/v1/songs/episode/testId");

          expect(songController.getSongsByEpisode).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/songs/character/:character", () => {
        it("should call getSongsByCharacter controller", async () => {
            await request(app).get("/api/v1/songs/character/testCharacter");

          expect(songController.getSongsByCharacter).toHaveBeenCalled();
        });
    });

    describe("GET /api/v1/songs/voiceActor/:songId", () => {
        it("should call getVoiceActorsBySong controller", async () => {
            await request(app).get("/api/v1/songs/voiceActor/testId");

          expect(songController.getVoiceActorsBySong).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/songs/", () => {
        it("should call createSong controller with valid data", async () => {
            const mockSong = {
                id: "Test ID",
                title: "Test Title",
                composers: ["Test Composer"],
                characters: ["Test Character"],
                time: "Test Time",
                episodeId: "Test Episode ID",
            }; 

            await request(app).post("/api/v1/songs/").send(mockSong);
            expect(songController.createSong).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/songs/:id", () => {
        it("should call updateSong controller with valid data", async () => {
            const mockSong = {
                title: "Updated Title",
                characters: ["Updated Character"],
            }; 

            await request(app).put("/api/v1/songs/testId").send(mockSong);
            expect(songController.updateSong).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/songs/:id", () => {
        it("should call deleteSong controller with valid data", async () => {
            await request(app).delete("/api/v1/songs/testId");
            expect(songController.deleteSong).toHaveBeenCalled();
        });
    });

})