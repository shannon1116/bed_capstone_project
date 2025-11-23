import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as voiceActorService from "../services/voiceActorService";
import { VoiceActor } from "../models/voiceActorModel";

/**
 * Manages requests and reponses to retrieve all Songs
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllVoiceActors = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const voiceActors: VoiceActor[] = await voiceActorService.getAllVoiceActors();
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actors retrieved successfully",
            data: voiceActors,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to retrieve a Voice Actor
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getOneVoiceActor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Voice Actor ID is required."
            });
            return;
        }
        
        const voiceActor: VoiceActor = await voiceActorService.getOneVoiceActor(id);
        
        if (!voiceActor) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Voice Actor not found."
            });
            return;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor retrieved successfully",
            data: voiceActor,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create a Voice Actor
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createVoiceActor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requiredFields: (keyof VoiceActor)[] = [
            'id',
            'name',
            'characters',
        ];
        
        const missingFields = requiredFields.filter(field => !(field in req.body));
        
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required parameter."
            });
            return;
        }
        
        const { id, name, characters } = req.body;
        
        const newVoiceActor: VoiceActor = await voiceActorService.createVoiceActor({
            id,
            name,
            characters,
        });
        
        res.status(HTTP_STATUS.CREATED).json({
            message: "Voice Actor created successfully",
            data: newVoiceActor,
        });

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update a Voice Actor
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateVoiceActor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        const { name, characters } = req.body;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Voice Actor ID is required.",
            });
            return;
        }
        
        const updatedVoiceActor: VoiceActor = await voiceActorService.updateVoiceActor(id, { name, characters });
        
        if (!name) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Name string is empty.",
            });
            return;
        }
        
        if (!characters) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Character array is empty.",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor updated successfully",
            data: updatedVoiceActor,
        });

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete a Voice Actor
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteVoiceActor = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Voice Actor ID is required.",
            });
            return;
        }
        
        const voiceActor: VoiceActor = await voiceActorService.getOneVoiceActor(id);
        
        if (!voiceActor) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Voice Actor not found.",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor successfully deleted",
        });
        
    } catch (error: unknown) {
        next(error);
    }
};