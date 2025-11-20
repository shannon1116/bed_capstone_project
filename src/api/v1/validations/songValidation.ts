import Joi, { ObjectSchema } from "joi";

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