import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as songService from "../services/songService";
import { Song } from "../models/songModel";

/**
 * Manages requests and reponses to retrieve all Songs
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllSongs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const songs: Song[] = await songService.getAllSongs();
        res.status(HTTP_STATUS.OK).json({
            message: "Songs retrieved successfully",
            data: songs,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to retrieve a Song
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getOneSong = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Song ID is required."
            });
            return;
        }

        const song: Song = await songService.getOneSong(id);

        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Song not found."
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Song retrieved successfully",
            data: song,
        });

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create a Song
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createSong = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requiredFields: (keyof Song)[] = [
            'id',
            'title',
            'composers',
            'characters',
            'time',
            'episodeId',
        ];
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required parameter."
            });
            return;
        }

        const { id, title, composers, characters, time, episodeId } = req.body;

        const newSong: Song = await songService.createSong({
            id,
            title,
            composers,
            characters,
            time,
            episodeId,
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Song created successfully",
            data: newSong,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update a Song
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateSong = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        const { title, characters } = req.body;

        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Song ID is required.",
            });
            return;
        }

        const updatedSong: Song = await songService.updateSong(id, { title, characters });

        if (!title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Title string is empty.",
            });
            return;
        }

        if (!characters) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Characters array is empty.",
            });
            return;
        }

        res.status(HTTP_STATUS.OK).json({
            message: "Song updated successfully",
            data: updatedSong,
        });

    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete a Song
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteSong = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;

        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Song ID is required.",
            });
            return;
        }

        const song: Song = await songService.getOneSong(id);

        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Song not found.",
            });
            return;
        }

        await songService.deleteSong(id);
        res.status(HTTP_STATUS.OK).json({
            message: "Song successfully deleted",
        });
        
    } catch (error: unknown) {
        next(error);
    }
};