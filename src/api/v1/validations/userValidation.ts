import Joi from "joi";

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - uid
 *         - email
 *       properties:
 *         uid:
 *           type: string
 *           description: The unique identifier for a user
 *           example: "132"
 *         email:
 *           type: string
 *           description: The email address of the user
 *           example: "johndoe@example.com"
 *         emailVerified:
 *           type: boolean
 *           description: Indicates if the user's email is verified
 *           example: true
 *         disabled:
 *           type: boolean
 *           description: Indicates if the user account is disabled
 *           example: false
 *         metadata:
 *           type: object
 *           description: Metadata related to the user
 *           properties:
 *             lastSignInTime:
 *               type: string
 *               description: The last time the user signed in
 *               example: "2023-10-10T08:30:00Z"
 *             creationTime:
 *               type: string
 *               description: The time the user account was created
 *               example: "2023-10-01T12:00:00Z"
 *             lastRefreshTime:
 *               type: string
 *               description: The last time the user data was refreshed
 *               example: "2023-10-15T14:45:00Z"
 *         customClaims:
 *           type: object
 *           description: Custom claims assigned to the user
 *           example:
 *             role: "admin"
 *         tokensValidAfterTime:
 *           type: string
 *           description: The time after which tokens are valid
 *           example: "2023-10-01T12:00:00Z"
 *         providerData:
 *           type: array
 *           description: Information about the user's identity providers
 *           items:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: The unique identifier from the identity provider
 *                 example: "some.name@google.ca"
 *               email:
 *                 type: string
 *                 description: The email from the identity provider
 *                 example: "johndoe@gmail.com"
 *               providerId:
 *                 type: string
 *                 description: The identifier of the identity provider
 *                 example: "google.com"
 */

// User operation schemas organized by request part
export const userSchemas = {
    // GET /users/:uid - Gets single user
    getById: {
        params: Joi.object({
            uid: Joi.string().required().messages({
                "any.required": "UID is required",
                "string.empty": "UID cannot be empty",
            }),
        }),
    },
};