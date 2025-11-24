import * as episodeService from "../src/api/v1/services/episodeService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Episode } from "../src/api/v1/models/episodeModel";
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

const makeMockEpisode = (overrides: Partial<Episode> = {}): Episode => ({
    id: "121",
    title: "The Future",
    airdate: "June 3, 2023",
    season: "4",
    episode: "43",
    director: "Micah Bates",
    writers: ["Philip Vargas", "Cathy Black"],
    ...overrides,
});

describe("Episode Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getAllEpisodes", () => {
        it("fetches all episodes", async () => {
            const mockEpisodes = [makeMockEpisode()];
            const mockSnapshot = createMockSnapshot<Episode>(
                mockEpisodes.map(episode => ({
                    id: episode.id,
                    data: { ...episode },
                }))
            );
            
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);
            
            const result = await episodeService.getAllEpisodes();
            
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject(mockEpisodes[0]);
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelEpisodes");
        });
        
        describe("getOneEpisode", () => {
            it("returns episode when found", async () => {
                const mockEpisode = makeMockEpisode({ id: "1" });
                
                const { id, ...rest } = mockEpisode;
                const mockDoc = createMockDoc<Episode>(id, { id, ...rest });
                
                (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
                
                const result = await episodeService.getOneEpisode(mockEpisode.id);
                
                expect(result).toMatchObject(mockEpisode);
                expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("HazbinHotelEpisodes", mockEpisode.id);
            });
        });
        
        describe("createEpisode", () => {
            it("creates and returns a new episode", async () => {
                const mockEpisode = makeMockEpisode();
                
                (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockEpisode.id);
                
                const result = await episodeService.createEpisode(mockEpisode);
                
                expect(result).toMatchObject(mockEpisode);
                
                expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                    "HazbinHotelEpisodes",
                    expect.objectContaining({
                        id: mockEpisode.id,
                    }),
                    mockEpisode.id
                );
            });
        });
        
        describe("updateEpisode", () => {
            it("updates and returns an updated episode", async () => {
                const mockEpisode = makeMockEpisode({ id: "132" });
                const updates = { title: "Heavenly", writers: ["Kyle Monday", "Blake Quinn"] };
                
                const originalDoc = createMockDoc<Episode>(mockEpisode.id, mockEpisode);
                const updatedDoc = createMockDoc<Episode>(mockEpisode.id, { ...mockEpisode, ...updates });
                
                (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(originalDoc) 
                .mockResolvedValueOnce(updatedDoc); 
                
                (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);
                
                const result = await episodeService.updateEpisode(mockEpisode.id, updates);
                
                expect(result.title).toBe(updates.title);
                expect(result.writers).toBe(updates.writers);
                expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("HazbinHotelEpisodes", mockEpisode.id, updates);
            });
        });
        
        describe("deleteEpisode", () => {
            it("deletes a episode without error", async () => {
                const id = "221";
                
                (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);
                
                await expect(episodeService.deleteEpisode(id)).resolves.toBeUndefined();
                
                expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("HazbinHotelEpisodes", id);
            });
        });
    });
});