import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as episodeController from "../src/api/v1/controllers/episodeController";
import * as episodeService from "../src/api/v1/services/episodeService";
import { Episode } from "../src/api/v1/models/episodeModel";
import { sampleEpisodes as mockEpisodes } from "../src/data/episodes";
// import { mock } from "node:test";

jest.mock("../src/api/v1/services/episodeService");

describe("Episode Controller", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;

    // reusable mocks for any controller tests
    beforeEach(() => {
        jest.clearAllMocks();
        mockReq = { params: {}, body: {} };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe("createEpisode", () => {
            it("should handle successful creation and give an HTTP_STATUS of 201", async () => {
                const mockBody = {
                    id: "154",
                    title: "Pitable",
                    airdate: "March 12, 2021",
                    season: "3",
                    episode: "5",
                    director: "Livi",
                    writers: ["Hannah Vine"]
                };
    
                const mockEpisode: Episode = {
                    ...mockBody
                };
    
                mockReq.body = mockBody;
                (episodeService.createEpisode as jest.Mock).mockResolvedValue(mockEpisode);
    
                await episodeController.createEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
    
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
                expect(mockRes.json).toHaveBeenCalledWith({
                    data: mockEpisode,
                    message: "Episode created successfully",
                    status: "success"
                });
            });
    
           it("should return 400 if a parameter is missing.", async () => {
                const mockBody = {
                    id: "54",
                    title: "Hellfire",
                    airdate: "August 3, 2021",
                    season: "4",
                    episode: "9",
                    director: "Bailey Kay",
                };
    
                mockReq.body = mockBody;
                (episodeService.createEpisode as jest.Mock).mockResolvedValue(mockBody);
    
                await episodeController.createEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
    
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                expect(mockRes.json).toHaveBeenCalledWith({
                    code: undefined,
                    error: "Missing required parameter",
                    status: "error",
                });
            });
        });

        describe("getAllEpisodes", () => {
            it("should return all Episodes and HTTP_STATUS 200", async () => {
                (episodeService.getAllEpisodes as jest.Mock).mockResolvedValue(mockEpisodes);
        
                await episodeController.getAllEpisodes(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(mockRes.json).toHaveBeenCalledWith({
                    data: mockEpisodes,
                    message: "Episodes retrieved successfully",
                    status: "success",
                });
            });
        
        });
        
        describe("getOneEpisode", () => {
            it("should return an episode when found and HTTP_STATUS of 200", async () => {
        
                const targetId = "107"
                const expectedEpisode = mockEpisodes.find(episode => episode.id === targetId);
        
                mockReq = {
                    params: { id: targetId.toString() },
                };
        
                (episodeService.getOneEpisode as jest.Mock).mockResolvedValue(expectedEpisode);
        
                await episodeController.getOneEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(episodeService.getOneEpisode).toHaveBeenCalledWith(targetId);
                expect(mockRes.json).toHaveBeenCalledWith({
                    data: expectedEpisode,
                    message: "Episode retrieved successfully",
                    status: "success",
                });
            });
        
            it("should return an error message and HTTP_STATUS of 400", async () => {
        
                const targetId = ""
                const expectedEpisode = mockEpisodes.find(episode => episode.id === targetId);
        
                mockReq = {
                    params: { id: targetId.toString() },
                };
        
                (episodeService.getOneEpisode as jest.Mock).mockResolvedValue(expectedEpisode);
        
                await episodeController.getOneEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                expect(episodeService.getOneEpisode).not.toHaveBeenCalled();
                expect(mockRes.json).toHaveBeenCalledWith({
                    code: undefined,
                    error: "Episode ID is required",
                    status: "error",
                });
            });
        })

        describe("updateEpisode", () => {
            it("should update the title and writers of the episode and return an HTTP_STATUS of 200", async () => {
        
                const targetId = "103";
                const updateData = { title: "Bargain", writers: ["Tasha Lynn"]};
        
                const updatedEpisode = {
                    ...mockEpisodes.find(episode => episode.id === targetId),
                    ...updateData
                };
        
                mockReq = {
                    params: { id: targetId.toString() },
                    body: updateData,
                };
        
                (episodeService.updateEpisode as jest.Mock).mockResolvedValue(updatedEpisode);
        
                await episodeController.updateEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(episodeService.updateEpisode).toHaveBeenCalledWith(targetId, updateData);
        
                expect(mockRes.json).toHaveBeenCalledWith({
                    data: expect.objectContaining(updatedEpisode),
                    message: "Episode updated successfully",
                    status: "success",
                })
        
                expect(updatedEpisode.title).toBe(updateData.title);
                expect(updatedEpisode.writers).toBe(updateData.writers);
                    
            });
        
            it("should return error message and an HTTP_STATUS of 400", async () => {
        
                const targetId = "206";
                const updateData = { title: "Laughing Ghost"};
        
                const updatedEpisode = {
                    ...mockEpisodes.find(episode => episode.id === targetId),
                    ...updateData
                };
        
                mockReq = {
                    params: { id: targetId.toString() },
                    body: updateData,
                };
        
                (episodeService.updateEpisode as jest.Mock).mockResolvedValue(updatedEpisode);
        
                await episodeController.updateEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
        
                expect(mockRes.json).toHaveBeenCalledWith({
                    code: undefined,
                    error: "Writers array is empty.",
                    status: "error",
                })
                    
            });
        })

        describe("deleteEpisode", () => {
            it("should delete the episode specified and return HTTP_STATUS 200", async () => {
        
                const targetId = "102";
                const expectedEpisode = mockEpisodes.find(episode => episode.id === targetId);
        
                mockReq = {
                    params: { id: targetId.toString() },
                };
        
                (episodeService.getOneEpisode as jest.Mock).mockResolvedValue(expectedEpisode);
                (episodeService.deleteEpisode as jest.Mock).mockResolvedValue(undefined);
        
                await episodeController.deleteEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(episodeService.getOneEpisode).toHaveBeenCalledWith(targetId);
                expect(episodeService.deleteEpisode).toHaveBeenCalledWith(targetId);
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(mockRes.json).toHaveBeenCalledWith({
                    data: null,
                    message: "Episode successfully deleted",
                    status: "success",
                });
            });
        
            it("should return error message and HTTP_STATUS 400", async () => {
        
                const targetId = "";
        
                mockReq = {
                    params: { id: targetId.toString() },
                };
        
                (episodeService.getOneEpisode as jest.Mock).mockResolvedValue(undefined);
        
                await episodeController.deleteEpisode(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
        
                expect(episodeService.getOneEpisode).not.toHaveBeenCalled();
                expect(episodeService.deleteEpisode).not.toHaveBeenCalled();
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                expect(mockRes.json).toHaveBeenCalledWith({
                    code: undefined,
                    error: "Episode ID is required.",
                    status: "error",
                });
            });
        })
});