import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { voiceActorSchemas } from "../validations/voiceActorValidation";
import * as voiceActorController from "../controllers/voiceActorController";

import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

const router: Router = express.Router();

// "/api/v1/voiceActors" prefixes all below routes

/**
 * @openapi
 * /voiceActors:
 *   post:
 *     summary: Create a new voice actor
 *     tags: [VoiceActors]
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
 *               - voiceActorName
 *               - characters
 *             properties:
 *               id:
 *                 type: string
 *                 example: "11"
 *               voiceActorName:
 *                 type: string
 *                 example: "Tory Beckett"
 *               characters:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Luna", "Patti"]
 *     responses:
 *       201:
 *         description: Voice actor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
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
    validateRequest(voiceActorSchemas.create),
    voiceActorController.createVoiceActor
);

/**
 * @openapi
 * /voiceActors:
 *   get:
 *     summary: Retrieve a list of voice actors
 *     tags: [VoiceActors]
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
 *         description: Max number of voice actors returned
 *     responses:
 *       200:
 *         description: List of voice actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VoiceActor'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
    "/",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(voiceActorSchemas.list), 
    voiceActorController.getAllVoiceActors
);

/**
 * @openapi
 * /voiceActors/{id}:
 *   get:
 *     summary: Get a specific voice actor
 *     tags: [VoiceActors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Voice actor ID
 *     responses:
 *       200:
 *         description: Voice actor retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Voice actor not found
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(voiceActorSchemas.getById),
    voiceActorController.getOneVoiceActor
);

/**
 * @openapi
 * /voiceActors/{id}:
 *   put:
 *     summary: Update an existing voice actor
 *     tags: [VoiceActors]
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
 *             $ref: '#/components/schemas/VoiceActor'
 *     responses:
 *       200:
 *         description: Voice actor updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Voice actor not found
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["editor"] }),
    validateRequest(voiceActorSchemas.update), 
    voiceActorController.updateVoiceActor
);

/**
 * @openapi
 * /voiceActors/{id}:
 *   delete:
 *     summary: Delete a voice actor
 *     tags: [VoiceActors]
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
 *         description: Voice actor deleted
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Voice actor not found
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(voiceActorSchemas.delete), 
    voiceActorController.deleteVoiceActor
);

export default router;