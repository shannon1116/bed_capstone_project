import * as songService from "../src/api/v1/services/songService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Song } from "../src/api/v1/models/songModel";
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

const makeMockSong = (overrides: Partial<Song> = {}): Song => ({
    id: "121",
    title: "The Future",
    composers: ["Allen Brighton", "Cindy Lane"],
    characters: ["Patrick", "Becka"],
    time: "4 min 2 sec",
    episodeId: "121",
    ...overrides,
});

describe("Song Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe("getAllSongs", () => {
        it("fetches all songs", async () => {
            const mockSongs = [makeMockSong()];
            const mockSnapshot = createMockSnapshot<Song>(
                mockSongs.map(song => ({
                    id: song.id,
                    data: { ...song },
                }))
            );
            
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);
            
            const result = await songService.getAllSongs();
            
            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBe(1);
            expect(result[0]).toMatchObject(mockSongs[0]);
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelSongs");
        });
        
        describe("getOneSong", () => {
            it("returns song when found", async () => {
                const mockSong = makeMockSong({ id: "1" });
                
                const { id, ...rest } = mockSong;
                const mockDoc = createMockDoc<Song>(id, { id, ...rest });
                
                (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue(mockDoc);
                
                const result = await songService.getOneSong(mockSong.id);
                
                expect(result).toMatchObject(mockSong);
                expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("HazbinHotelSongs", mockSong.id);
            });
        });
        
        describe("createSong", () => {
            it("creates and returns a new song", async () => {
                const mockSong = makeMockSong();
                
                (firestoreRepository.createDocument as jest.Mock).mockResolvedValue(mockSong.id);
                
                const result = await songService.createSong(mockSong);
                
                expect(result).toMatchObject(mockSong);
                
                expect(firestoreRepository.createDocument).toHaveBeenCalledWith(
                    "HazbinHotelSongs",
                    expect.objectContaining({
                        id: mockSong.id,
                    }),
                    mockSong.id
                );
            });
        });
        
        describe("updateSong", () => {
            it("updates and returns an updated song", async () => {
                const mockSong = makeMockSong({ id: "321" });
                const updates = { title: "Bittersweet", characters: ["Mayday", "Kim"] };
                
                const originalDoc = createMockDoc<Song>(mockSong.id, mockSong);
                const updatedDoc = createMockDoc<Song>(mockSong.id, { ...mockSong, ...updates });
                
                (firestoreRepository.getDocumentById as jest.Mock)
                .mockResolvedValueOnce(originalDoc) 
                .mockResolvedValueOnce(updatedDoc); 
                
                (firestoreRepository.updateDocument as jest.Mock).mockResolvedValue(undefined);
                
                const result = await songService.updateSong(mockSong.id, updates);
                
                expect(result.title).toBe(updates.title);
                expect(result.characters).toBe(updates.characters);
                expect(firestoreRepository.updateDocument).toHaveBeenCalledWith("HazbinHotelSongs", mockSong.id, updates);
            });
        });
        
        describe("deleteSong", () => {
            it("deletes a song without error", async () => {
                const id = "211";
                
                (firestoreRepository.deleteDocument as jest.Mock).mockResolvedValue(undefined);
                
                await expect(songService.deleteSong(id)).resolves.toBeUndefined();
                
                expect(firestoreRepository.deleteDocument).toHaveBeenCalledWith("HazbinHotelSongs", id);
            });
        });
    });
});