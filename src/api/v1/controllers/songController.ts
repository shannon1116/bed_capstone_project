import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as songService from "../services/songService";
// import { Song, EpisodeSongs, CharacterSongs } from "../models/songModel";
import { successResponse, errorResponse } from "../models/responseModel";


/** Retrieve ALL songs */
export const getAllSongs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const songs = await songService.getAllSongs();
        res.status(HTTP_STATUS.OK).json(
            successResponse(songs, "Songs retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};


/** Retrieve one song */
export const getOneSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const song = await songService.getOneSong(id);

        if (!song) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Song not found."));
            return;
        }

        res.status(HTTP_STATUS.OK).json(successResponse(song, "Song retrieved successfully"));
    } catch (error) {
        next(error);
    }
};


/** Create a new song */
export const createSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const newSong = await songService.createSong(req.body);

        res.status(HTTP_STATUS.CREATED).json(
            successResponse(newSong, "Song created successfully")
        );
    } catch (error) {
        next(error);
    }
};


/** Update a song */
export const updateSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, characters } = req.body;

        const updatedSong = await songService.updateSong(id, { title, characters });

        if (!updatedSong) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Song not found."));
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(updatedSong, "Song updated successfully")
        );
    } catch (error) {
        next(error);
    }
};


/** Delete a song */
export const deleteSong = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const existing = await songService.getOneSong(id);
        if (!existing) {
            res.status(HTTP_STATUS.NOT_FOUND).json(errorResponse("Song not found."));
            return;
        }

        await songService.deleteSong(id);

        res.status(HTTP_STATUS.OK).json(successResponse(null, "Song successfully deleted"));
    } catch (error) {
        next(error);
    }
};


/** Get songs by episode */
export const getSongsByEpisode = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { episodeId } = req.params;

        const songs = await songService.getSongsByEpisode(episodeId);

        if (songs.length === 0) {
            res.status(HTTP_STATUS.NOT_FOUND).json(
                errorResponse("No songs found for this episode")
            );
            return;
        }

        res.status(HTTP_STATUS.OK).json(
            successResponse(songs, "Songs retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};


/** Get songs by character */
export const getSongsByCharacter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { character } = req.params;

        const songs = await songService.getSongsByCharacter(character);

        res.status(HTTP_STATUS.OK).json(
            successResponse(songs, "Songs retrieved successfully")
        );
    } catch (error) {
        next(error);
    }
};


// get the voice actors for characters and add them to the song array