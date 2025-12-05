import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { 
    Song,
    EpisodeSongs,
    CharacterSongs,
    VoiceActorSongs,
} from "../models/songModel";
import {
    VoiceActor,
 } from "../models/voiceActorModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";

const songs: Song[] = [];

const HazbinHotelSongs: string = "HazbinHotelSongs";

const HazbinHotelVoiceActors: string = "HazbinHotelVoiceActors";

/**
 * Retrieves all songs from services
 * @returns Array of all songs
 */

export const getAllSongs = async (): Promise<Song[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(HazbinHotelSongs);
        const songs: Song[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Song;
        });

        return songs;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves one song from services
 * @param id - The ID of the song to be retrieved
 * @returns The Song being retrieved
 * @throws If the id doesn't match a song listed
 */

export const getOneSong = async (id: string): Promise<Song> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            HazbinHotelSongs,
            id
        );

        if (!doc) {
            throw new Error(`Song with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        if (!data) {
            throw new Error(`No data found for song with ID "${id}"`);
        }
        
        const song: Song = {
            id: doc.id,
            ...data,
        } as Song;

        return structuredClone(song);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new song
 * @param songData - the data for the new song
 * @returns The created song with generated ID
 */

export const createSong = async (songData: Song): Promise<Song> => {
    try {
        const docId = await createDocument<Song>(HazbinHotelSongs, songData, songData.id);

        const newSong: Song = {
            ...songData,
            id: docId, 
        };

        songs.push(newSong);

        return structuredClone(newSong);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing song
 * @param id - The ID of the song to update
 * @param songData - the fields to update (title, characters)
 * @returns The updated Song
 * @throws Error if the song with given ID is not found
 */
export const updateSong = async (
    id: string,
    songData: Pick<Song, "title" | "characters">
): Promise<Song> => {
    const doc = await getDocumentById(HazbinHotelSongs, id);

    if (!doc || !doc.exists) {
        throw new Error(`Song with ID ${id} not found`);
    }

    await updateDocument(HazbinHotelSongs, id, songData);

    const updatedDoc = await getDocumentById(HazbinHotelSongs, id);
    
    if (!updatedDoc || !updatedDoc.exists) {
        throw new Error(`Failed to retrieve updated song with ID ${id}`);
    }

    const data = updatedDoc.data();
    
    if (!data) {
        throw new Error(`No data found for updated song with ID ${id}`);
    }

    return {
        id: updatedDoc.id,
        ...data,
    } as Song;
};

/**
 * Deletes a song from storage
 * @param id - the ID of the song to delete
 * @throws Error if song with given ID is not found
 */

export const deleteSong = async (id: string): Promise<void> => {
    try {
        // check if the song exists before deleting
        const song: Song = await getOneSong(id);
        if (!song) {
            throw new Error(`Song with ID ${id} not found`);
        }

        await deleteDocument(HazbinHotelSongs, id);
    } catch (error: unknown) {
        throw error;
    }
};

/**getSongsByEpisode
 * gets all songs for a specific episode
 * @param episodeId - The Episode ID of the songs
 * @returns An list of songs belonging to a specific episode
 */
export const getSongsByEpisode = async (episodeId: string): Promise<EpisodeSongs[]> => {
    try {
        const snapshot = await getDocuments(HazbinHotelSongs);

        const episodeSongs: EpisodeSongs[] = snapshot.docs
            .map(doc => {
                const data = doc.data() ?? {};
                return {
                    id: doc.id,
                    title: data.title,
                    episodeId: data.episodeId,
                };
            })
            .filter(episodeSongs => episodeSongs.episodeId === episodeId);

        return structuredClone(episodeSongs);
    } catch (error: unknown) {
        throw error;
    }
};

/**getSongsByCharacter
 * gets all songs for a specific character
 * @param character - The Character that sings each song
 * @returns An array of songs belonging to the specific character
 */
export const getSongsByCharacter = async (
    character: string
): Promise<CharacterSongs[]> => {
    try {
        const snapshot = await getDocuments(HazbinHotelSongs);

        const characterSongs: CharacterSongs[] = snapshot.docs
            .map(doc => {
                const data = doc.data() ?? {};
                return {
                    id: doc.id,
                    title: data.title,
                    characters: data.characters ?? []
                } as CharacterSongs;
            })
            .filter(song => song.characters.includes(character));

        return structuredClone(characterSongs);
    } catch (error) {
        throw error;
    }
};

/**getVoiceActorsBySong
 * gets all the voice actors for a specific song
 * @param songId - The song the Voice Actors sing
 * @returns An array of voice actors belonging to the specific song
 */
export const getVoiceActorsBySong = async (
    songId: string
): Promise<VoiceActorSongs[]> => {
    try {
        const songSnapshot = await getDocumentById(HazbinHotelSongs, songId);

        if (!songSnapshot || !songSnapshot.exists) {
            throw new Error(`Song with ID ${songId} not found`);
        }

        const song = { id: songSnapshot.id, ...songSnapshot.data() } as Song;

        if (!song.characters || !Array.isArray(song.characters)) {
            throw new Error(`Song ${songId} has no 'characters' field or it is not an array`);
        }

        const songCharacters = song.characters;

        const voiceActorSnapshot = await getDocuments(HazbinHotelVoiceActors);

        const voiceActors: VoiceActor[] = voiceActorSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as VoiceActor));

        const matchedVoiceActors: VoiceActorSongs[] = voiceActors
            .map(actor => {
                const matches = actor.characters.filter(character =>
                    songCharacters.includes(character)
                );

                if (matches.length === 0) return null;

                return {
                    id: actor.id,
                    name: actor.name,
                    characters: matches,
                    song: {
                        id: song.id,
                        title: song.title,
                    },
                } as VoiceActorSongs;
            })
            .filter(Boolean) as VoiceActorSongs[];

        return structuredClone(matchedVoiceActors);

    } catch (error) {
        throw error;
    }
};