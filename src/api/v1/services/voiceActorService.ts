import {
    QuerySnapshot,
    DocumentData,
    DocumentSnapshot,
} from "firebase-admin/firestore";
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


const voiceActors: VoiceActor[] = [];

const COLLECTION: string = "HazbinHotelVoiceActors";

/**
 * Retrieves all voice actors from services
 * @returns Array of all voice actors
 */

export const getAllVoiceActors = async (): Promise<VoiceActor[]> => {
    try {
        const snapshot: QuerySnapshot = await getDocuments(COLLECTION);
        const voiceActors: VoiceActor[] = snapshot.docs.map((doc) => {
            const data: DocumentData = doc.data();
            return {
                id: doc.id,
                ...data,
            } as VoiceActor;
        });

        return voiceActors;
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Retrieves one voice actor from services
 * @param id - The ID of the voice actor to be retrieved
 * @returns The Voice Actor being retrieved
 * @throws If the id doesn't match a voice actor listed
 */

export const getOneVoiceActor = async (id: string): Promise<VoiceActor> => {
    try {
        const doc: DocumentSnapshot | null = await getDocumentById(
            COLLECTION,
            id
        );

        if (!doc) {
            throw new Error(`Voice Actor with ID ${id} not found`);
        }

        const data: DocumentData | undefined = doc.data();
        if (!data) {
            throw new Error(`No data found for voice actor with ID "${id}"`);
        }
        
        const voiceActor: VoiceActor = {
            id: doc.id,
            ...data,
        } as VoiceActor;

        return structuredClone(voiceActor);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Creates a new song
 * @param voiceActorData - the data for the new song
 * @returns The created song with generated ID
 */

export const createVoiceActor = async (voiceActorData: VoiceActor): Promise<VoiceActor> => {
    try {
        const docId = await createDocument<VoiceActor>(COLLECTION, voiceActorData, voiceActorData.id);

        const newVoiceActor: VoiceActor = {
            ...voiceActorData,
            id: docId, 
        };

        voiceActors.push(newVoiceActor);

        return structuredClone(newVoiceActor);
    } catch (error: unknown) {
        throw error;
    }
};

/**
 * Updates (replaces) an existing voice actor
 * @param id - The ID of the voice actor to update
 * @param songData - the fields to update (voiceActorName, characters)
 * @returns The updated voice actor
 * @throws Error if the voice actor with given ID is not found
 */
export const updateVoiceActor = async (
    id: string,
    voiceActorData: Pick<VoiceActor, "name" | "characters">
): Promise<VoiceActor> => {
    const doc = await getDocumentById(COLLECTION, id);

    if (!doc || !doc.exists) {
        throw new Error(`Voice Actor with ID ${id} not found`);
    }

    await updateDocument(COLLECTION, id, voiceActorData);

    const updatedDoc = await getDocumentById(COLLECTION, id);
    
    if (!updatedDoc || !updatedDoc.exists) {
        throw new Error(`Failed to retrieve updated voice actor with ID ${id}`);
    }

    const data = updatedDoc.data();
    
    if (!data) {
        throw new Error(`No data found for updated voice actor with ID ${id}`);
    }

    return {
        id: updatedDoc.id,
        ...data,
    } as VoiceActor;
};

/**
 * Deletes a voice actor from storage
 * @param id - the ID of the voice actor to delete
 * @throws Error if voice actor with given ID is not found
 */

export const deleteVoiceActor = async (id: string): Promise<void> => {
    try {
        // check if the song exists before deleting
        const song: VoiceActor = await getOneVoiceActor(id);
        if (!song) {
            throw new Error(`Voice Actor with ID ${id} not found`);
        }

        await deleteDocument(COLLECTION, id);
    } catch (error: unknown) {
        throw error;
    }
};
