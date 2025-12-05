import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - uid
 *         - roles
 *       properties:
 *         uid:
 *           type: string
 *           description: The unique identifier for a user
 *           example: "132"
 *         roles:
 *           type: object
 *           description: The roles assigned to the user
 *           example: { roles: "admin" }
 */

// User operation schemas organized by request part
export const adminSchemas = {
    // POST /admin/:uid - Create role for user
    getById: {
        params: Joi.object({
            uid: Joi.string().required().messages({
                "any.required": "UID is required",
                "string.empty": "UID cannot be empty",
            }),
        }),
        body: Joi.object({
            roles: Joi.object().required().messages({
                "any.required": "Roles are required",
                "object.base": "Roles must be an object",
            }),
        }),
    },
};