import express from "express";
import { setCustomClaims } from "../controllers/adminController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: express.Router = express.Router();

// "/api/v1/admin" prefixes all below routes

/**
 * @openapi
 * /admin/setCustomClaims:
 *   post:
 *     summary: Set custom claims for a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - uid
 *               - claims
 *             properties:
 *               uid:
 *                 type: string
 *                 description: Unique identifier of the user
 *                 example: "user-uid-123"
 *               claims:
 *                 type: object
 *                 description: Custom claims to assign
 *                 example:
 *                   admin: true
 *                   moderator: false
 *     responses:
 *       200:
 *         description: Custom claims set successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default router;