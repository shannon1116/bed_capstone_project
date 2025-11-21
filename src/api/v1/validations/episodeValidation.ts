import Joi, { ObjectSchema } from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Episode:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - season
 *         - episode
 *         - director
 *         - writers
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for an episode
 *           example: "132"
 *         title:
 *           type: string
 *           description: The title of the episode
 *           example: "Bailey's Win"
 *         season:
 *           type: string
 *           description: The season the episode is in
 *           example: "1"
 *         episode:
 *           type: string
 *           description: The episode number
 *           example: "8"
 *         director:
 *           type: string
 *           description: the name of the director of the episode
 *           example: "Gallagher Charles"
 *         writers:
 *           type: array
 *           description: The names of who wrote the episode
 *           example: "Thomas Blakely, Livi Fine"
 */

// Episode operation schemas organized by request part
export const episodeSchemas = {
    // POST /episodes - Create new episode
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
            season: Joi.string().required().messages({
                "any.required": "Season is required",
                "string.empty": "Season cannot by empty",
            }),
            episode: Joi.string().required().messages({
                "any.required": "Episode is required",
                "string.empty": "Episode cannot be empty",
            }),
            director: Joi.string().required().messages({
                "any.required": "Director is required",
                "string.empty": "Director cannot be empty",
            }),
            writers: Joi.array().required().messages({
                "any.required": "Writers are required",
                "string.empty": "Writers cannot be empty",
            }),
        }),
    },

    // GET /episodes/:id - Gets single episode
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // PUT /episodes/:id - Updates episode
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
            writers: Joi.array().required().messages({
                "any.required": "Characters are required",
                "string.empty": "Characters cannot be empty",
            }),
        }),
    },
    
    // DELETE /episodes/:id - Deletes episode
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // GET /episodes - Lists episodes
    list: {
        query: Joi.object({}),
    },
};