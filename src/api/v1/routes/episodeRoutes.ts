import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { episodeSchemas } from "../validations/episodeValidation";
import * as episodeController from "../controllers/episodeController";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// "/api/v1/episodes" prefixes all below routes

/**
 * @openapi
 * /episodes:
 *   post:
 *     summary: Create a new episode
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - title
 *               - season
 *               - episode
 *               - director
 *               - writers
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               season:
 *                 type: string
 *               episode:
 *                 type: string
 *               director:
 *                 type: string
 *               writers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Episode created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["user"] }),
    validateRequest(episodeSchemas.create),
    episodeController.createEpisode
);

/**
 * @openapi
 * /episodes:
 *   get:
 *     summary: Retrieve a list of episodes
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: episodeId
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the episode
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Max number of episodes returned
 *     responses:
 *       200:
 *         description: A list of episodes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(episodeSchemas.list), 
    episodeController.getAllEpisodes
);

/**
 * @openapi
 * /episodes/{id}:
 *   get:
 *     summary: Get a specific episode
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The episode ID
 *     responses:
 *       200:
 *         description: Episode retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Episode not found
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(episodeSchemas.getById),
    episodeController.getOneEpisode
);

/**
 * @openapi
 * /episodes/{id}:
 *   put:
 *     summary: Update a specific episode
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: Episode updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Episode not found
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["editor"] }),
    validateRequest(episodeSchemas.update), 
    episodeController.updateEpisode
);

/**
 * @openapi
 * /episodes/{id}:
 *   delete:
 *     summary: Delete a specific episode
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Episode deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Episode not found
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(episodeSchemas.delete), 
    episodeController.deleteEpisode
);

export default router;