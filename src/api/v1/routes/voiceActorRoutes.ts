import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { voiceActorSchemas } from "../validations/voiceActorValidation";
import * as voiceActorController from "../controllers/voiceActorController";

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
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "11"
 *               voiceActorName:
 *                 type: string
 *                 example: "Tory Beckett"
 *               characters:
 *                 type: array
 *                 example: "Luna, Patti"
 *     responses:
 *       201:
 *         description: Voice Actor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Voice actor with this name already exists
 */
router.post(
    "/",
    validateRequest(voiceActorSchemas.create),
    voiceActorController.createVoiceActor
);

/**
 * @openapi
 * /voiceActors:
 *   get:
 *     summary: Retrieve a list of voice actors with optional filtering
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
 *         description: Maximum number of voice actors to return
 *     responses:
 *       200:
 *         description: A list of voice actors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               songs:
 *                 $ref: '#/components/schemas/VoiceActor'
 */
router.get("/", voiceActorController.getAllVoiceActors);

/**
 * @openapi
 * /voiceActors/{voiceActorId}:
 *   get:
 *     summary: Get a specific voice actor's information
 *     tags: [VoiceActors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: voiceActorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the voice actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoiceActor'
 *     responses:
 *       200:
 *         description: Voice Actor retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
 *       404:
 *         description: Episode not found
 *       403:
 *         description: Not authorized to retrieve this voice actor
 */
router.get(
    "/:id",
    validateRequest(voiceActorSchemas.getById),
    voiceActorController.getOneVoiceActor
);

/**
 * @openapi
 * /voiceActors/{voiceActorId}:
 *   put:
 *     summary: Update a specific voice actor's information
 *     tags: [VoiceActors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: voiceActorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the voice actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoiceActor'
 *     responses:
 *       200:
 *         description: Voice Actor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
 *       404:
 *         description: Voice actor not found
 *       403:
 *         description: Not authorized to update this voice actor
 */
router.put("/:id", voiceActorController.updateVoiceActor);

/**
 * @openapi
 * /voiceActors/{voiceActorId}:
 *   delete:
 *     summary: Deletes a specific voice actor
 *     tags: [VoiceActors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: voiceActorId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the voice actor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VoiceActor'
 *     responses:
 *       200:
 *         description: Voice Actor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VoiceActor'
 *       404:
 *         description: Voice actor not found
 *       403:
 *         description: Not authorized to delete this voice actor
 */
router.delete("/:id", voiceActorController.deleteVoiceActor);

export default router;