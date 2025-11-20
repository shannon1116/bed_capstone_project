import Joi, { ObjectSchema } from "joi";

// Voice Actor operation schemas organized by request part
export const songSchemas = {
    // POST /voiceActors - Create new voice actor
    create: {
        body: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
            voiceActorName: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            characters: Joi.array().required().messages({
                "any.required": "Characters are required",
                "string.empty": "Characters cannot be empty",
            }),
        }),
    },

    // GET /voiceActors/:id - Gets single voice actor
    getById: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // PUT /voiceActors/:id - Updates voice actor
    update: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be emptry",
            }),
        }),
        body: Joi.object({
            voiceActorName: Joi.string().required().messages({
                "any.required": "Name is required",
                "string.empty": "Name cannot be empty",
            }),
            characters: Joi.array().required().messages({
                "any.required": "Characters are required",
                "string.empty": "Characters cannot be empty",
            }),
        }),
    },
    
    // DELETE /voiceActors/:id - Deletes voice actor
    delete: {
        params: Joi.object({
            id: Joi.string().required().messages({
                "any.required": "ID is required",
                "string.empty": "ID cannot be empty",
            }),
        }),
    },

    // GET /voiceActors - Lists voice actors
    list: {
        query: Joi.object({}),
    },
};