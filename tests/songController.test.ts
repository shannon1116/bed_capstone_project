import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as songController from "../src/api/v1/controllers/songController";
import * as songService from "../src/api/v1/services/songService";
import { Song } from "../src/api/v1/models/songModel";
import { sampleSongs as mockSongs } from "../src/data/songs";
//import { mock } from "node:test";

jest.mock("../src/api/v1/services/songService");

describe("Song Controller", () => {
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

    describe("createSong", () => {
        it("should handle successful creation and give an HTTP_STATUS of 201", async () => {
            const mockBody = {
                id: "154",
                title: "Pitable",
                composers: ["Timothy Kennedy"],
                characters: ["Charlie"],
                time: "2 min 43 sec",
                episodeId: "321",
            };

            const mockSong: Song = {
                ...mockBody
            };

            mockReq.body = mockBody;
            (songService.createSong as jest.Mock).mockResolvedValue(mockSong);

            await songController.createSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: mockSong,
                message: "Song created successfully",
                status: "success",
            });
        });

       it("should return 400 if a parameter is missing.", async () => {
            const mockBody = {
                id: "54",
                title: "Hellfire",
                characters: ["Penny Lane"],
                time: "0 min 54 sec",
                episodeId: "522",
            };

            mockReq.body = mockBody;
            (songService.createSong as jest.Mock).mockResolvedValue(mockBody);

            await songController.createSong(
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

    describe("getAllSongs", () => {
        it("should return all Songs and HTTP_STATUS 200", async () => {
            (songService.getAllSongs as jest.Mock).mockResolvedValue(mockSongs);

            await songController.getAllSongs(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: mockSongs,
                message: "Songs retrieved successfully",
                status: "success",
            });
        });

    });

    describe("getOneSong", () => {
        it("should return a song when found and HTTP_STATUS of 200", async () => {

            const targetId = "109"
            const expectedSong = mockSongs.find(song => song.id === targetId);

            mockReq = {
                params: { id: targetId.toString() },
            };

            (songService.getOneSong as jest.Mock).mockResolvedValue(expectedSong);

            await songController.getOneSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(songService.getOneSong).toHaveBeenCalledWith(targetId);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: expectedSong,
                message: "Song retrieved successfully",
                status: "success",
            });
        });

        it("should return an error message and HTTP_STATUS of 400", async () => {

            const targetId = ""
            const expectedSong = mockSongs.find(song => song.id === targetId);

            mockReq = {
                params: { id: targetId.toString() },
            };

            (songService.getOneSong as jest.Mock).mockResolvedValue(expectedSong);

            await songController.getOneSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(songService.getOneSong).not.toHaveBeenCalled();
            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Song ID is required",
                status: "error",
            });
        });
    })

    describe("updateSong", () => {
        it("should update the title and characters of the song and return an HTTP_STATUS of 200", async () => {

            const targetId = "202";
            const updateData = { title: "Luck", characters: ["Bee", "Mikey"]};

            const updatedSong = {
                ...mockSongs.find(song => song.id === targetId),
                ...updateData
            };

            mockReq = {
                params: { id: targetId.toString() },
                body: updateData,
            };

            (songService.updateSong as jest.Mock).mockResolvedValue(updatedSong);

            await songController.updateSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(songService.updateSong).toHaveBeenCalledWith(targetId, updateData);

            expect(mockRes.json).toHaveBeenCalledWith({
                data: expect.objectContaining(updatedSong),
                message: "Song updated successfully",
                status: "success",
            })

            expect(updatedSong.title).toBe(updateData.title);
            expect(updatedSong.characters).toBe(updateData.characters);
            
        });

        it("should return error message and an HTTP_STATUS of 400", async () => {

            const targetId = "206";
            const updateData = { title: "Peppermint"};

            const updatedSong = {
                ...mockSongs.find(song => song.id === targetId),
                ...updateData
            };

            mockReq = {
                params: { id: targetId.toString() },
                body: updateData,
            };

            (songService.updateSong as jest.Mock).mockResolvedValue(updatedSong);

            await songController.updateSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);

            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Characters array is empty.",
                status: "error",
            })
            
        });
    })

    describe("deleteSong", () => {
        it("should delete the song specified and return HTTP_STATUS 200", async () => {

            const targetId = "103";
            const expectedSong = mockSongs.find(song => song.id === targetId);

            mockReq = {
                params: { id: targetId.toString() },
            };

            (songService.getOneSong as jest.Mock).mockResolvedValue(expectedSong);
            (songService.deleteSong as jest.Mock).mockResolvedValue(undefined);

            await songController.deleteSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getOneSong).toHaveBeenCalledWith(targetId);
            expect(songService.deleteSong).toHaveBeenCalledWith(targetId);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: null,
                message: "Song successfully deleted",
                status: "success",
            });
        });

        it("should return error message and HTTP_STATUS 400", async () => {

            const targetId = "";

            mockReq = {
                params: { id: targetId.toString() },
            };

            (songService.getOneSong as jest.Mock).mockResolvedValue(undefined);

            await songController.deleteSong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getOneSong).not.toHaveBeenCalled();
            expect(songService.deleteSong).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Song ID is required.",
                status: "error",
            });
        });
    })

});