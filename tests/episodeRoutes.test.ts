import request from "supertest";
import app from "../src/app";
import * as episodeController from "../src/api/v1/controllers/episodeController";
import { HTTP_STATUS } from "../src/constants/httpConstants";

jest.mock("../src/api/v1/controllers/episodeController", () => ({
    createEpisode: jest.fn((req, res) => res.status(HTTP_STATUS.CREATED).send()),
    getAllEpisodes: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    getOneEpisode: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    updateEpisode: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
    deleteEpisode: jest.fn((req, res) => res.status(HTTP_STATUS.OK).send()),
}));

describe("Episode Routes", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /api/v1/episodes/", () => {
        it("should call getAllEpisodes controller", async () => {
            await request(app)
            .get("/api/v1/episodes")
            .query({
                id: "Test ID",
                title: "Test Title",
                airdate: "Test Date",
                season: "Test Season",
                episode: "Test Episode",
                director: "Test Director",
                writers: ["Test Writer"],
            });
        });
    });

    describe("GET /api/v1/episodes/:id", () => {
        it("should call getOneEpisodes controller", async () => {
          await request(app).get("/api/v1/episodes/testId");
          expect(episodeController.getOneEpisode).toHaveBeenCalled();
        });
    });

    describe("POST /api/v1/episodes/", () => {
        it("should call createEpisode controller with valid data", async () => {
            const mockEpisode = {
                id: "Test ID",
                title: "Test Title",
                airdate: "Test Date",
                season: "Test Season",
                episode: "Test Episode",
                director: "Test Director",
                writers: ["Test Writer"],
            }; 

            await request(app).post("/api/v1/episodes/").send(mockEpisode);
            expect(episodeController.createEpisode).toHaveBeenCalled();
        });
    });

    describe("PUT /api/v1/episodes/:id", () => {
        it("should call updateEpisode controller with valid data", async () => {
            const mockEpisode = {
                title: "Updated Title",
                writers: ["Updated Writer"],
            }; 

            await request(app).put("/api/v1/episodes/testId").send(mockEpisode);
            expect(episodeController.updateEpisode).toHaveBeenCalled();
        });
    });

    describe("DELETE /api/v1/episodes/:id", () => {
        it("should call deleteEpisode controller with valid data", async () => {
            await request(app).delete("/api/v1/episodes/testId");
            expect(episodeController.deleteEpisode).toHaveBeenCalled();
        });
    });

})