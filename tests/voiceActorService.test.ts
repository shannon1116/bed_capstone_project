import * as voiceActorService from "../src/api/v1/services/voiceActorService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { VoiceActor } from "../src/api/v1/models/voiceActorModel";
import { QuerySnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository");

const createMockDoc = <T>(id: string, data: T): QueryDocumentSnapshot<T> => ({
    id,
    exists: true,
    data: () => data,
} as unknown as QueryDocumentSnapshot<T>);

const createMockSnapshot = <T>(docsData: Array<{ id: string; data: T }>): QuerySnapshot<T> => ({
    docs: docsData.map(doc => createMockDoc<T>(doc.id, doc.data)),
    empty: docsData.length === 0,
    size: docsData.length,
} as unknown as QuerySnapshot<T>);

const makeMockVoiceActor = (overrides: Partial<VoiceActor> = {}): VoiceActor => ({
    id: "12",
    name: "Frederick Gates",
    characters: ["Allen", "Garfield"],
    ...overrides,
});

describe("Voice Actor Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getAllSongs", () => {
        it("fetches all songs", async () => {
            const mockVoiceActors = [makeMockVoiceActor()];
            const mockSnapshot = createMockSnapshot<VoiceActor>(
                mockVoiceActors.map(voiceActor => ({
                    id: voiceActor.id,
                    data: { ...voiceActor },
                }))
            );
            
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);
            
            const result = await voiceActorService.getAllVoiceActors();
            
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject(mockVoiceActors[0]);
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelVoiceActors");
        });
        
        describe("getOneVoiceActor", () => {
            it("returns song when found", async () => {
                const mockVoiceActor = makeMockVoiceActor({ id: "1" });
                
                const { id, ...rest } = mockVoiceActor;
                const mockDoc = createMockDoc<VoiceActor>(id, { id, ...rest });
                
                (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
                
                const result = await voiceActorService.getOneVoiceActor(mockVoiceActor.id);
                
                expect(result).toMatchObject(mockVoiceActor);
                expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("HazbinHotelVoiceActors", mockVoiceActor.id);
            });
        });
        
        describe("createVoiceActor", () => {
            it("creates and returns a new voice actor", async () => {
                const mockVoiceActor = makeMockVoiceActor();
                
                (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockVoiceActor.id);
                
                const result = await voiceActorService.createVoiceActor(mockVoiceActor);
                
                expect(result).toMatchObject(mockVoiceActor);
                
                expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                    "HazbinHotelVoiceActors",
                    expect.objectContaining({
                        id: mockVoiceActor.id,
                    }),
                    mockVoiceActor.id
                );
            });
        });
        
        describe("updateVoiceActor", () => {
            it("updates and returns an updated voice actor", async () => {
                const mockVoiceActor = makeMockVoiceActor({ id: "32" });
                const updates = { name: "Greg Bennett", characters: ["Chowder", "Louie"] };
                
                const originalDoc = createMockDoc<VoiceActor>(mockVoiceActor.id, mockVoiceActor);
                const updatedDoc = createMockDoc<VoiceActor>(mockVoiceActor.id, { ...mockVoiceActor, ...updates });
                
                (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(originalDoc) 
                .mockResolvedValueOnce(updatedDoc); 
                
                (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);
                
                const result = await voiceActorService.updateVoiceActor(mockVoiceActor.id, updates);
                
                expect(result.name).toBe(updates.name);
                expect(result.characters).toBe(updates.characters);
                expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("HazbinHotelVoiceActors", mockVoiceActor.id, updates);
            });
        });
        
        describe("deleteVoiceActor", () => {
            it("deletes a voice actor without error", async () => {
                const id = "35";
                
                (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);
                
                await expect(voiceActorService.deleteVoiceActor(id)).resolves.toBeUndefined();
                
                expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("HazbinHotelVoiceActors", id);
            });
        });
    });
});