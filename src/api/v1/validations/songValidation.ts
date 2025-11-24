import Joi, { ObjectSchema } from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Song:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - composers
 *         - characters
 *         - time
 *         - episodeId
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for a song
 *           example: "123"
 *         title:
 *           type: string
 *           description: The title of the song
 *           example: "High Cost"
 *         composers:
 *           type: array
 *           description: The names of the composers of the song
 *           example: ["Gina Lin", "Garrett Victor"]
 *         characters:
 *           type: array
 *           description: The names of characters who sing the song
 *           example: ["Charlie", "Michael"]
 *         time:
 *           type: string
 *           description: the duration of the song
 *           example: "3 min 2 sec"
 *         episodeId:
 *           type: string
 *           description: The id of the episode the song is in
 *           example: "209"
 */

// Song operation schemas organized by request part
export const songSchemas = {
    // POST /songs - Create new song
    create: {
        body: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
            title: Joi.string().required().messages({
                "any.required": "Title is required",
                "string.empty": "Title cannot be empty",
            }),
            composers: Joi.array().required().messages({
                "any.required": "Composers are required",
                "string.empty": "Composers cannot be empty",
            }),
            characters: Joi.array().required().messages({
                "any.required": "Characters are required",
                "string.empty": "Characters cannot be empty",
            }),
            time: Joi.string().required().messages({
                "any.required": "Time is required",
                "string.empty": "Time cannot be empty",
            }),
            episodeId: Joi.string().required().messages({
                "any.required": "Episode ID is required",
                "string.empty": "Episode ID cannot be empty",
            }),
        }),
    },

    // GET /songs/:id - Gets single song
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // GET /songs/episode/:episodeId - Get by episode
    getByEpisode: {
        params: Joi.object({
            branchId: Joi.string().required().messages({
                "any.required": "Episode ID is required",
                "string.empty": "Episode ID cannot be empty",
            }),
        }),
    },

    // PUT /songs/:id - Updates song
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be emptry",
            }),
        }),
        body: Joi.object({
            title: Joi.string().required().messages({
                "any.required": "Title is required",
                "string.empty": "Title cannot be empty",
            }),
            characters: Joi.array().required().messages({
                "any.required": "Characters are required",
                "string.empty": "Characters cannot be empty",
            }),
        }),
    },
    
    // DELETE /songs/:id - Deletes song
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // GET /song - Lists songs
    list: {
        query: Joi.object({}),
    },
};