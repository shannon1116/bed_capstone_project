import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../src/constants/httpConstants";
import * as voiceActorController from "../src/api/v1/controllers/voiceActorController";
import * as voiceActorService from "../src/api/v1/services/voiceActorService";
import { VoiceActor } from "../src/api/v1/models/voiceActorModel";
import { sampleVoiceActors as mockVoiceActors } from "../src/data/voiceActors";
// import { mock } from "node:test";

jest.mock("../src/api/v1/services/voiceActorService");

describe("Voice Actor Controller", () => {
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

    describe("createVoiceActor", () => {
        it("should handle successful creation and give an HTTP_STATUS of 201", async () => {
            const mockBody = {
                id: "93",
                name: "Mariah Day",
                characters: ["Max"]
            };
        
            const mockVoiceActor: VoiceActor = {
                ...mockBody
            };
        
            mockReq.body = mockBody;
            (voiceActorService.createVoiceActor as jest.Mock).mockResolvedValue(mockVoiceActor);
        
            await voiceActorController.createVoiceActor(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );
        
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
            expect(mockRes.json).toHaveBeenCalledWith({
            message: "Voice Actor created successfully",
                data: mockVoiceActor,
            });
        });
        
        it("should return 400 if a parameter is missing.", async () => {
            const mockBody = {
                id: "54",
                name: "Peter Bright",
            };
        
            mockReq.body = mockBody;
            (voiceActorService.createVoiceActor as jest.Mock).mockResolvedValue(mockBody);
        
            await voiceActorController.createVoiceActor(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );
        
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Missing required parameter.",
            });
        });
    });

    describe("getAllVoiceActors", () => {
        it("should return all Voice Actors and HTTP_STATUS 200", async () => {
            (voiceActorService.getAllVoiceActors as jest.Mock).mockResolvedValue(mockVoiceActors);
            
            await voiceActorController.getAllVoiceActors(
                mockReq as Request,
                mockRes as Response,
                mockNext
            );
            
            expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Voice Actors retrieved successfully",
                    data: mockVoiceActors,
                });
            });
            
        });
            
        describe("getOneVoiceActor", () => {
            it("should return a voice actor when found and HTTP_STATUS of 200", async () => {
            
                const targetId = "10"
                const expectedVoiceActor = mockVoiceActors.find(voiceActor => voiceActor.id === targetId);
            
                mockReq = {
                    params: { id: targetId.toString() },
                };
            
                (voiceActorService.getOneVoiceActor as jest.Mock).mockResolvedValue(expectedVoiceActor);
            
                await voiceActorController.getOneVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
            
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(voiceActorService.getOneVoiceActor).toHaveBeenCalledWith(targetId);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Voice Actor retrieved successfully",
                    data: expectedVoiceActor,
                });
            });
            
            it("should return an error message and HTTP_STATUS of 400", async () => {
            
                const targetId = ""
                const expectedVoiceActor = mockVoiceActors.find(voiceActor => voiceActor.id === targetId);
            
                mockReq = {
                    params: { id: targetId.toString() },
                };
            
                (voiceActorService.getOneVoiceActor as jest.Mock).mockResolvedValue(expectedVoiceActor);
            
                await voiceActorController.getOneVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
            
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                expect(voiceActorService.getOneVoiceActor).not.toHaveBeenCalled();
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Voice Actor ID is required.",
                });
            });
        })

        describe("updateVoiceActor", () => {
            it("should update the name and characters of the voice actor and return an HTTP_STATUS of 200", async () => {
                
                const targetId = "7";
                const updateData = { name: "Courtney Gallagher", characters: ["Parker"]};
                
                const updatedVoiceActor = {
                    ...mockVoiceActors.find(voiceActor => voiceActor.id === targetId),
                    ...updateData
                };
                
                mockReq = {
                    params: { id: targetId.toString() },
                    body: updateData,
                };
                
                (voiceActorService.updateVoiceActor as jest.Mock).mockResolvedValue(updatedVoiceActor);
                
                await voiceActorController.updateVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
                
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(voiceActorService.updateVoiceActor).toHaveBeenCalledWith(targetId, updateData);
                
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Voice Actor updated successfully",
                    data: expect.objectContaining(updatedVoiceActor),
                })
                
                expect(updatedVoiceActor.name).toBe(updateData.name);
                expect(updatedVoiceActor.characters).toBe(updateData.characters);
            
            });
                
            it("should return error message and an HTTP_STATUS of 400", async () => {
                
                const targetId = "2";
                const updateData = { characters: ["Beckett"]};
                
                const updatedVoiceActor = {
                    ...mockVoiceActors.find(voiceActor => voiceActor.id === targetId),
                    ...updateData
                };
                
                mockReq = {
                    params: { id: targetId.toString() },
                    body: updateData,
                };
                
                (voiceActorService.updateVoiceActor as jest.Mock).mockResolvedValue(updatedVoiceActor);
                
                await voiceActorController.updateVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
                
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Name string is empty.",
                })
            });
        })
        
        describe("deleteVoiceActor", () => {
            it("should delete the voice actor specified and return HTTP_STATUS 200", async () => {
                
                const targetId = "21";
                const expectedVoiceActor = mockVoiceActors.find(voiceActor => voiceActor.id === targetId);
                
                mockReq = {
                    params: { id: targetId.toString() },
                };
                
                (voiceActorService.getOneVoiceActor as jest.Mock).mockResolvedValue(expectedVoiceActor);
                (voiceActorService.deleteVoiceActor as jest.Mock).mockResolvedValue(undefined);
                
                await voiceActorController.deleteVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
                
                expect(voiceActorService.getOneVoiceActor).toHaveBeenCalledWith(targetId);
                expect(voiceActorService.deleteVoiceActor).toHaveBeenCalledWith(targetId);
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Voice Actor successfully deleted",
                });
            });
                
            it("should return error message and HTTP_STATUS 400", async () => {
                
                const targetId = "";
                
                mockReq = {
                    params: { id: targetId.toString() },
                };
                
                (voiceActorService.getOneVoiceActor as jest.Mock).mockResolvedValue(undefined);
                
                await voiceActorController.deleteVoiceActor(
                    mockReq as Request,
                    mockRes as Response,
                    mockNext
                );
                
                expect(voiceActorService.getOneVoiceActor).not.toHaveBeenCalled();
                expect(voiceActorService.deleteVoiceActor).not.toHaveBeenCalled();
                expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
                expect(mockRes.json).toHaveBeenCalledWith({
                    message: "Voice Actor ID is required.",
                });
            });
        })
        
});