import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { 
    Song, 
} from "../models/songModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";


const songs: Song[] = [];

const COLLECTION: string = "hazbinHotelSongs";

/**
 * Retrieves all songs from services
 * @returns Array of all songs
 */

export const getAllSongs = async (): Promise<Song[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
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
            COLLECTION,
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
        const docId = await createDocument<Song>(COLLECTION, songData, songData.id);

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
    const doc = await getDocumentById(COLLECTION, id);

    if (!doc || !doc.exists) {
        throw new Error(`Song with ID ${id} not found`);
    }

    await updateDocument(COLLECTION, id, songData);

    const updatedDoc = await getDocumentById(COLLECTION, id);
    
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

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};
