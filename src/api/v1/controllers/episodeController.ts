import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "../../../constants/httpConstants";
import * as episodeService from "../services/episodeService";
import { Episode } from "../models/episodeModel";

/**
 * Manages requests and reponses to retrieve all Episodes
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getAllEpisodes = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const episodes: Episode[] = await episodeService.getAllEpisodes();
        res.status(HTTP_STATUS.OK).json({
            message: "Episodes retrieved successfully",
            data: episodes,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to retrieve one Episode
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const getOneEpisode = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Episode ID is required."
            });
            return;
        }
        
        const episode: Episode = await episodeService.getOneEpisode(id);
        
        if (!episode) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Episode not found."
            });
            return;
        }
        
        res.status(HTTP_STATUS.OK).json({
            message: "Episode retrieved successfully",
            data: episode,
        });
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests, reponses, and validation to create a Episode
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const createEpisode = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const requiredFields: (keyof Episode)[] = [
            'id',
            'title',
            'airdate',
            'season',
            'episode',
            'director',
            'writers',
        ];
        
        const missingFields = requiredFields.filter(field => !(field in req.body));
        
        if (missingFields.length > 0) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Missing required parameter."
            });
            return;
        }
        
        const { id, title, airdate, season, episode, director, writers } = req.body;
        
        const newEpisode: Episode = await episodeService.createEpisode({
            id,
            title,
            airdate,
            season,
            episode,
            director,
            writers,
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Episode created successfully",
            data: newEpisode,
        });
    
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to update a Episode
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const updateEpisode = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        const { title, writers } = req.body;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Episode ID is required.",
            });
            return;
        }
        
        const updatedEpisode: Episode = await episodeService.updateEpisode(id, { title, writers });
        
        if (!title) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Title string is empty.",
            });
            return;
        }
        
        if (!writers) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Writers array is empty.",
            });
            return;
        }
        res.status(HTTP_STATUS.OK).json({
            message: "Episode updated successfully",
            data: updatedEpisode,
        });
    
    } catch (error: unknown) {
        next(error);
    }
};

/**
 * Manages requests and reponses to delete a Episode
 * @param req - The express Request
 * @param res  - The express Response
 * @param next - The express middleware chaining function
 */
export const deleteEpisode = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const id: string = req.params.id;
        
        if (!id || id.trim() === "") {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Episode ID is required.",
            });
            return;
        }
        
        const episode: Episode = await episodeService.getOneEpisode(id);
        
        if (!episode) {
            res.status(HTTP_STATUS.NOT_FOUND).json({
                message: "Episode not found.",
            });
            return;
        }

        await episodeService.deleteEpisode(id);

        res.status(HTTP_STATUS.OK).json({
            message: "Episode successfully deleted",
        });
        
    } catch (error: unknown) {
        next(error);
    }
};