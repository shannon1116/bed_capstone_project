import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { songSchemas } from "../validations/songValidation";
import * as songController from "../controllers/songController";

const router: Router = express.Router();

// "/api/v1/songs" prefixes all below routes

/**
 * @openapi
 * /songs/episode/{episodeId}:
 *   get:
 *     summary: Gets all the songs in an episode
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: episodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the episode
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *       404:
 *         description: Song not found
 */
router.get(
    "/episode/:episodeId", 
    validateRequest(songSchemas.getByEpisode), 
    songController.getSongsByEpisode
);

/**
 * @openapi
 * /songs/character/{character}:
 *   get:
 *     summary: Gets all the songs by character
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: character
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique name of the character
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *       404:
 *         description: Songs not found
 */
router.get(
    "/character/:character", 
    validateRequest(songSchemas.getSongsByCharacter), 
    songController.getSongsByCharacter
);

/**
 * @openapi
 * /songs/voiceActor/{songId}:
 *   get:
 *     summary: Gets all the voice actors by song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique id of the song
 *     responses:
 *       200:
 *         description: Voice Actors retrieved successfully
 *       404:
 *         description: No Voice Actors found for this song.
 */
router.get(
    "/voiceActor/:songId", 
    validateRequest(songSchemas.getVoiceActorsBySong), 
    songController.getVoiceActorsBySong
);

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
 */
router.get(
    "/", 
    validateRequest(songSchemas.list), 
    songController.getAllSongs
);

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
 *     responses:
 *       201:
 *         description: Song created successfully
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Song with this ID already exists
 */
router.post(
    "/",
    validateRequest(songSchemas.create),
    songController.createSong
);

/**
 * @openapi
 * /songs/{songId}:
 *   get:
 *     summary: Get a specific song
 *     tags: [Songs]
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song retrieved successfully
 *       404:
 *         description: Song not found
 */
router.get(
    "/:id",
    validateRequest(songSchemas.getById),
    songController.getOneSong
);

/**
 * @openapi
 * /songs/{songId}:
 *   put:
 *     summary: Update a specific song
 *     tags: [Songs]
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Song updated successfully
 *       404:
 *         description: Song not found
 */
router.put(
    "/:id", 
    validateRequest(songSchemas.update), 
    songController.updateSong
);

/**
 * @openapi
 * /songs/{songId}:
 *   delete:
 *     summary: Deletes a specific song
 *     tags: [Songs]
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Song deleted successfully
 *       404:
 *         description: Song not found
 */
router.delete(
    "/:id", 
    validateRequest(songSchemas.delete), 
    songController.deleteSong
);

export default router;
