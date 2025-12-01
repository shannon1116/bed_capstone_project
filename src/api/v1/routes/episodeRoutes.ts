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
 *               - writer
 *             properties:
 *               id:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "111"
 *               title:
 *                 type: string
 *                 example: "The Title of the Song"
 *               season:
 *                 type: string
 *                 example: "2"
 *               episode:
 *                 type: string
 *                 example: "4"
 *               director:
 *                 type: string
 *                 example: "Susie Parker"
 *               writers:
 *                 type: array
 *                 example: "Jake Cross, Tory Bell"
 *     responses:
 *       201:
 *         description: Episode created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Episode with this name already exists
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
 *     summary: Retrieve a list of episodes with optional filtering
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of episodes to return
 *     responses:
 *       200:
 *         description: A list of episodes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               songs:
 *                 $ref: '#/components/schemas/Episode'
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager", "user"] }),
    validateRequest(episodeSchemas.list), 
    episodeController.getAllEpisodes
);

/**
 * @openapi
 * /episodes/{episodeId}:
 *   get:
 *     summary: Get a specific episodes's information
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: episodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the episode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: Episode retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       404:
 *         description: Episode not found
 *       403:
 *         description: Not authorized to retrieve this episode
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "manager", "user"] }),
    validateRequest(episodeSchemas.getById),
    episodeController.getOneEpisode
);

/**
 * @openapi
 * /episodes/{episodeId}:
 *   put:
 *     summary: Update a specific episode's information
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: episodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the episode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: Episode updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       404:
 *         description: Episode not found
 *       403:
 *         description: Not authorized to update this episode
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["manager"] }),
    validateRequest(episodeSchemas.update), 
    episodeController.updateEpisode
);

/**
 * @openapi
 * /episodes/{episodeId}:
 *   delete:
 *     summary: Deletes a specific episode
 *     tags: [Episodes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: episodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the episode
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Episode'
 *     responses:
 *       200:
 *         description: Episode deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Episode'
 *       404:
 *         description: Episode not found
 *       403:
 *         description: Not authorized to delete this episode
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(episodeSchemas.delete), 
    episodeController.deleteEpisode
);

export default router;