import express, { Router } from "express";
import * as songController from "../controllers/songController";

const router: Router = express.Router();

// "/api/v1/songs" prefixes all below routes

/**
 * @openapi
 * /songs:
 *   post:
 *     summary: Create a new song
 *     tags: [Songs]
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
 *               - composers
 *               - characters
 *               - time
 *               - episodeId
 *             properties:
 *               id:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "111"
 *               title:
 *                 type: string
 *                 example: "The Name of the Song"
 *               composers:
 *                 type: array
 *                 example: "Mike Bland", "Heather Blake"
 *               characters:
 *                 type: array
 *                 example: "Simon", "Judy"
 *               time:
 *                 type: string
 *                 example: "5 min 5 sec"
 *               episodeId:
 *                 type: string
 *                 example: "271"
 *     responses:
 *       201:
 *         description: Song created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Song with this name already exists
 */
router.post("/", songController.createSong);

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Retrieve a list of songs with optional filtering
 *     tags: [Songs]
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
 *         description: Maximum number of songs to return
 *     responses:
 *       200:
 *         description: A list of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               songs:
 *                 $ref: '#/components/schemas/Song'
 */
router.get("/", songController.getAllSongs);

/**
 * @openapi
 * /songs/{songId}:
 *   get:
 *     summary: Get a specific song's information
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the song
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to retrieve this song
 */
router.get("/:id", songController.getOneSong);

/**
 * @openapi
 * /songs/{songId}:
 *   put:
 *     summary: Update a specific song's information
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the song
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to update this song
 */
router.put("/:id", songController.updateSong);

/**
 * @openapi
 * /songs/{songId}:
 *   delete:
 *     summary: Deletes a specific song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - id: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the song
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to delete this song
 */
router.delete("/:id", songController.deleteSong);

export default router;