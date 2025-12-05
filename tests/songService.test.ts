import * as songService from "../src/api/v1/services/songService";
import * as firestoreRepository from "../src/api/v1/repositories/firestoreRepository";
import { Song } from "../src/api/v1/models/songModel";
import { QuerySnapshot, QueryDocumentSnapshot } from "firebase-admin/firestore";

// Mock the repository module
jest.mock("../src/api/v1/repositories/firestoreRepository", () => ({
    getDocuments: jest.fn(),
    getDocumentById: jest.fn(),
    createDocument: jest.fn(),
    updateDocument: jest.fn(),
    deleteDocument: jest.fn(),
}));

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

    describe("getSongsByEpisode", () => {
        it("returns songs when provided an episode ID", async () => {
            const mockSongs = [
                { id: "1", title: "Song A", episodeId: "101" },
                { id: "2", title: "Song B", episodeId: "101" },
                { id: "3", title: "Song C", episodeId: "102" }
            ];
                
            const mockSnapshot = createMockSnapshot(
                mockSongs.map(song => ({ id: song.id, data: { ...song } }))
            );
                
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await songService.getSongsByEpisode("101");

            expect(result).toHaveLength(2);
            expect(result.map(s => s.id)).toEqual(expect.arrayContaining(["1", "2"]));
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelSongs");
        });
    });

    describe("getSongsByCharacter", () => {
        it("returns songs when provided a character", async () => {
            const mockSongs = [
                { id: "1", title: "Song A", characters: ["Character X"] },
                { id: "2", title: "Song B", characters: ["Character X"] },
                { id: "3", title: "Song C", characters: ["Character Y"] }
            ];
                
            const mockSnapshot = createMockSnapshot(
                mockSongs.map(song => ({ id: song.id, data: { ...song } }))
            );
                
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockSnapshot);

            const result = await songService.getSongsByCharacter("Character X");

            expect(result).toHaveLength(2);
            expect(result.map(s => s.id)).toEqual(expect.arrayContaining(["1", "2"]));
            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelSongs");
        });
    });

    describe("getVoiceActorsBySong", () => {
        it("returns voice actors when provided a song id", async () => {
            
            const mockSong = { id: "1", title: "Song A", characters: ["Character X", "Character Z"] };

            const mockVoiceActors = [
                { id: "1", name: "Actor A", characters: ["Character X"] },
                { id: "2", name: "Actor B", characters: ["Character Y"] },
                { id: "3", name: "Actor C", characters: ["Character Z", "Character Y"] },
            ];

            (firestoreRepository.getDocumentById as jest.Mock).mockResolvedValue({
                id: mockSong.id,
                exists: true,
                data: () => mockSong,
            });

            const mockActorSnapshot = createMockSnapshot(
                mockVoiceActors.map(actor => ({ id: actor.id, data: actor }))
            );
            (firestoreRepository.getDocuments as jest.Mock).mockResolvedValue(mockActorSnapshot);
            
            const result = await songService.getVoiceActorsBySong("1");
            
            expect(result).toHaveLength(2);
            expect(result.map(a => a.id)).toEqual(expect.arrayContaining(["1", "3"]));

            expect(firestoreRepository.getDocuments).toHaveBeenCalledWith("HazbinHotelVoiceActors");
            expect(firestoreRepository.getDocumentById).toHaveBeenCalledWith("HazbinHotelSongs", "1");
        });
    });

});