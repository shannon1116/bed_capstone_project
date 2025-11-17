import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
import { 
    Episode, 
} from "../models/episodeModel";
import {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} from "../repositories/firestoreRepository";


const songs: Episode[] = [];

const COLLECTION: string = "HazbinHotelEpisodes";

/**
 * Retrieves all episodes from services
 * @returns Array of all episodes
 */

export const getAllEpisodes = async (): Promise<Episode[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const episodes: Episode[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as Episode;
        });

        return episodes;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves one episode from services
 * @param id - The ID of the song to be retrieved
 * @returns The Episode being retrieved
 * @throws If the id doesn't match a episode listed
 */

export const getOneEpisode = async (id: string): Promise<Episode> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`Episode with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        if (!data) {
            throw new Error(`No data found for episode with ID "${id}"`);
        }
        
        const episode: Episode = {
            id: doc.id,
            ...data,
        } as Episode;

        return structuredClone(episode);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new episode
 * @param episodeData - the data for the new song
 * @returns The created episode with generated ID
 */

export const createEpisode = async (episodeData: Episode): Promise<Episode> => {
    try {
        const docId = await createDocument<Episode>(COLLECTION, episodeData, episodeData.id);

        const newEpisode: Episode = {
            ...episodeData,
            id: docId, 
        };

        songs.push(newEpisode);

        return structuredClone(newEpisode);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing episode
 * @param id - The ID of the episode to update
 * @param songData - the fields to update (title, writers)
 * @returns The updated Episode
 * @throws Error if the episode with given ID is not found
 */
export const updateEpisode = async (
    id: string,
    episodeData: Pick<Episode, "title" | "writers">
): Promise<Episode> => {
    const doc = await getDocumentById(COLLECTION, id);

    if (!doc || !doc.exists) {
        throw new Error(`Episode with ID ${id} not found`);
    }

    await updateDocument(COLLECTION, id, episodeData);

    const updatedDoc = await getDocumentById(COLLECTION, id);
    
    if (!updatedDoc || !updatedDoc.exists) {
        throw new Error(`Failed to retrieve updated episode with ID ${id}`);
    }

    const data = updatedDoc.data();
    
    if (!data) {
        throw new Error(`No data found for updated episode with ID ${id}`);
    }

    return {
        id: updatedDoc.id,
        ...data,
    } as Episode;
};

/**
 * Deletes a episode from storage
 * @param id - the ID of the episode to delete
 * @throws Error if episode with given ID is not found
 */

export const deleteEpisode = async (id: string): Promise<void> => {
    try {
        // check if the song exists before deleting
        const episode: Episode = await getOneEpisode(id);
        if (!episode) {
            throw new Error(`Episode with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};
