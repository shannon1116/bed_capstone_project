import Joi, { ObjectSchema } from "joi";

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