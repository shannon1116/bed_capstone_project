import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";

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
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actors retrieved successfully",
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
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor retrieved successfully",
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
        res.status(HTTP_STATUS.CREATED).json({
            message: "Voice Actor created successfully",
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
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor updated successfully",
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
        res.status(HTTP_STATUS.OK).json({
            message: "Voice Actor successfully deleted",
        });
    } catch (error: unknown) {
        next(error);
    }
};