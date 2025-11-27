import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as songService from "../services/songService";
import { Song, EpisodeSongs, CharacterSongs } from "../models/songModel";
import { successResponse, errorResponse } from "../models/responseModel";

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
        res.status(HTTP_STATUS.OK).json(
            successResponse(songs, "Songs retrieved successfully")
        );
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to retrieve one Song
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
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Song ID is required")
            );
            return;
        }

        const song: Song = await songService.getOneSong(id);

        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("Song not found")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(song, "Song retrieved successfully")
        );

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
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Missing required parameter")
            );
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
        
        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newSong, "Song created successfully")
        );

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
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Song ID is required.")
            );
            return;
        }
        
        const updatedSong: Song = await songService.updateSong(id, { title, characters });
        
        if (!title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Title string is empty")
            );
            return;
        }
        
        if (!characters) {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Characters array is empty.")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedSong, "Song updated successfully")
        );

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
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Song ID is required.")
            );
            return;
        }
        
        const song: Song = await songService.getOneSong(id);
        
        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Song not found.",
            });
            return;
        }
        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("Song not found.")
            );
            return;
        }

        await songService.deleteSong(id);

        res.status(HTTP_STATUS.OK).json(
            successResponse(null, "Song successfully deleted")
        );
        
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to get Songs by Episode
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getSongsByEpisode = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const { episodeId } = req.params;

        if (!episodeId || episodeId.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Episode ID is required")
            );
            return;
        }

        const episodeSongs: EpisodeSongs[] = await songService.getSongsByEpisode(episodeId);

        if (episodeSongs.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("No songs found for this episode")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(episodeSongs, "Songs retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};

/**
 * Manages requests and reponses to get songs by Character
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getSongsByCharacter = async (
    req: Request, 
    res: Response, 
    next: NextFunction
): Promise<void> => {
    try {
        const { character } = req.params;

        if (!character || character.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json(
                errorResponse("Character is required")
            );
            return;
        }

        const characterSongs: CharacterSongs[] = await songService.getSongsByCharacter(character);

        if (characterSongs.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("No songs were found for this character")
            );
            return;
        }
        
        res.status(HTTP_STATUS.OK).json(
            successResponse(characterSongs, "Songs retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};

// get the voice actors for characters and add them to the song array