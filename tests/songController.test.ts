import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as songController from "../src/api/v1/controllers/songController";
import * as songService from "../src/api/v1/services/songService";
import {
    Song, 
    EpisodeSongs,
    CharacterSongs,
    VoiceActorSongs 
} from "../src/api/v1/models/songModel";
import { sampleSongs as mockSongs } from "../src/data/songs";
import { sampleVoiceActors as mockVoiceActors } from "../src/data/voiceActors";

jest.mock("../src/api/v1/services/songService");

jest.mock('../src/api/v1/repositories/firestoreRepository', () => ({
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

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

    describe("getSongsByEpisode", () => {
        it("should return a list of all Songs belonging to an Episode and HTTP_STATUS 200", async () => {

            const targetId = "102";

            const expectedEpisodeSongs: EpisodeSongs[] = mockSongs
            .filter(songs => songs.episodeId === targetId)
            .map(songs => ({
                id: songs.id,
                title: songs.title,
                episodeId: songs.episodeId,
            }));

            mockReq = {
                params: { episodeId: targetId.toString() },
            };

            (songService.getSongsByEpisode as jest.Mock).mockResolvedValue(expectedEpisodeSongs);

            await songController.getSongsByEpisode(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getSongsByEpisode).toHaveBeenCalledWith(targetId);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: expectedEpisodeSongs,
                message: "Songs retrieved successfully",
                status: "success",
            });

        });

        it("should return an error message and HTTP_STATUS 400", async () => {

            const targetId = "";

            const expectedEpisodeSongs: EpisodeSongs[] = mockSongs
            .filter(songs => songs.episodeId === targetId)
            .map(songs => ({
                id: songs.id,
                title: songs.title,
                episodeId: songs.episodeId,
            }));

            mockReq = {
                params: { episodeId: targetId.toString() },
            };

            (songService.getSongsByEpisode as jest.Mock).mockResolvedValue(expectedEpisodeSongs);

            await songController.getSongsByEpisode(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getSongsByEpisode).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Episode ID is required",
                status: "error",
            });

        });
    });

    describe("getSongsByCharacter", () => {
        it("should return an array of all Songs belonging to specific Character and HTTP_STATUS 200", async () => {

            const targetCharacter = "Vox";

            const expectedCharacterSongs: CharacterSongs[] = mockSongs
            .filter(songs => songs.characters.includes(targetCharacter))
            .map(songs => ({
                id: songs.id,
                title: songs.title,
                characters: songs.characters,
            }));

            mockReq = {
                params: { character: targetCharacter.toString() },
            };

            (songService.getSongsByCharacter as jest.Mock).mockResolvedValue(expectedCharacterSongs);

            await songController.getSongsByCharacter(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getSongsByCharacter).toHaveBeenCalledWith(targetCharacter);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: expectedCharacterSongs,
                message: "Songs retrieved successfully",
                status: "success",
            });

        });

        it("should return an error message and HTTP_STATUS 400", async () => {

            const targetCharacter = "";

            const expectedCharacterSongs: CharacterSongs[] = mockSongs
            .filter(songs => songs.characters.includes(targetCharacter))
            .map(songs => ({
                id: songs.id,
                title: songs.title,
                characters: songs.characters,
            }));

            mockReq = {
                params: { character: targetCharacter.toString() },
            };

            (songService.getSongsByCharacter as jest.Mock).mockResolvedValue(expectedCharacterSongs);

            await songController.getSongsByCharacter(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getSongsByCharacter).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Character is required",
                status: "error",
            });
        });
    })

    describe("getVoiceActorsBySong", () => {
        it("should return an array of all Voice Actors belonging to specific Song and HTTP_STATUS 200", async () => {

            const targetSongId = "203";

            const targetSong = mockSongs.find(song => song.id === targetSongId);
            expect(targetSong).toBeDefined();

            const expectedVoiceActors: VoiceActorSongs[] = mockVoiceActors
            .map(actor => {
                const matchedCharacters = actor.characters.filter(character =>
                    targetSong!.characters.includes(character)
                );

                if (matchedCharacters.length === 0) return null;
                
                return {
                    id: actor.id,
                    name: actor.name,
                    characters: matchedCharacters,
                    song: {
                        id: targetSong!.id,
                        title: targetSong!.title,   
                    },
                } as VoiceActorSongs;
            })
            .filter(Boolean) as VoiceActorSongs[]

            mockReq = { params: { songId: targetSongId } };

            (songService.getVoiceActorsBySong as jest.Mock).mockResolvedValue(expectedVoiceActors);

            await songController.getVoiceActorsBySong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getVoiceActorsBySong).toHaveBeenCalledWith(targetSongId);
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                data: expectedVoiceActors,
                message: "Voice Actors retrieved successfully",
                status: "success",
            });

        });

        it("should return an error message and HTTP_STATUS 400", async () => {

            mockReq = {
                params: { id: "" },
            };

            await songController.getVoiceActorsBySong(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );

            expect(songService.getVoiceActorsBySong).not.toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                code: undefined,
                error: "Song ID is required.",
                status: "error",
            });
        });
    })

});