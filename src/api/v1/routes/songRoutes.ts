import express, { Router } from "express";
import { validateRequest } from "../middleware/validate";
import { songSchemas } from "../validations/songValidation";
import * as songController from "../controllers/songController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";

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
 *     responses:
 *       201:
 *         description: Song created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
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
    validateRequest(songSchemas.create),
    songController.createSong
);

/**
 * @openapi
 * /songs/episode/{episodeId}:
 *   get:
 *     summary: Gets all songs in an episode
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: episodeId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier of the episode
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Songs not found
 */
router.get(
    "/episode/:episodeId",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(songSchemas.getByEpisode), 
    songController.getSongsByEpisode
);

/**
 * @openapi
 * /songs/character/{character}:
 *   get:
 *     summary: Gets all songs by character
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: character
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the character
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Songs not found
 */
router.get(
    "/character/:character",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(songSchemas.getSongsByCharacter), 
    songController.getSongsByCharacter
);

/**
 * @openapi
 * /songs/voiceActor/{songId}:
 *   get:
 *     summary: Gets all voice actors for a song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique ID of the song
 *     responses:
 *       200:
 *         description: Voice actors retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Song not found
 */
router.get(
    "/voiceActor/:songId",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(songSchemas.getVoiceActorsBySong), 
    songController.getVoiceActorsBySong
);

/**
 * @openapi
 * /songs:
 *   get:
 *     summary: Retrieve a list of songs
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of songs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Song'
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
    validateRequest(songSchemas.list), 
    songController.getAllSongs
);

/**
 * @openapi
 * /songs/{id}:
 *   get:
 *     summary: Get a specific song
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Song ID
 *     responses:
 *       200:
 *         description: Song retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Song not found
 */
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
    validateRequest(songSchemas.getById),
    songController.getOneSong
);

/**
 * @openapi
 * /songs/{id}:
 *   put:
 *     summary: Update a song
 *     tags: [Songs]
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
 *             $ref: '#/components/schemas/Song'
 *     responses:
 *       200:
 *         description: Song updated
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Song not found
 */
router.put(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["editor"] }),
    validateRequest(songSchemas.update), 
    songController.updateSong
);

/**
 * @openapi
 * /songs/{id}:
 *   delete:
 *     summary: Delete a song
 *     tags: [Songs]
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
 *         description: Song deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Song not found
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(songSchemas.delete), 
    songController.deleteSong
);

export default router;
