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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EpisodeSongs'
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EpisodeSongs'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to retrieve these songs
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
 *     summary: Gets all the songs by character
 *     tags: [Songs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - characters: character
 *         in: path
 *         required: true
 *         schema:
 *           type: array
 *         description: The unique name of the character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             characters:
 *          example: ["Character One", "Character Two"]
 *     responses:
 *       200:
 *         description: Songs retrieved successfully
 *         content:
 *         application/json:
 *          schema:
 *           type: array
 *          songs:
 *            $ref: '#/components/schemas/CharacterSongs'
 *       404:
 *         description: Songs not found
 *       403:
 *         description: Not authorized to retrieve these songs
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
 *        content:
 *          application/json:
 *           schema:
 *            type: array
 *            voiceActors:
 *              $ref: '#/components/schemas/VoiceActorSongs'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to retrieve this song
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
 *       403:
 *         description: Not authorized to retrieve this song
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
 *              - id
 *              - title
 *              - composers
 *              - characters
 *              - time
 *              - episodeId
 *            properties:
 *              id:
 *               type: string
 *               minLength: 3
 *               maxLength: 50
 *               example: "001"
 *              title:
 *               type: string
 *               example: "The Title of the Song"
 *             composers:
 *              type: array
 *              example: ["Composer One", "Composer Two"]
 *             characters:
 *              type: array
 *              example: ["Character One", "Character Two"]
 *             time:
 *              type: string
 *              example: "2 min 30 sec"
 *             episodeId:
 *              type: string
 *              example: "111"
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
 *         description: Song with this ID already exists
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
router.get(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin", "editor", "user"] }),
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
 *       - id: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the song
 *     requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *     responses:
 *         200:
 *         description: Song updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Song'
 *         404:
 *           description: Song not found
 *         403:
 *           description: Not authorized to update this song
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
 * /songs/{songId}:
 *   delete:
 *     summary: Deletes a specific song
 *     tags: [Songs]
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *       - id: songId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *        description: The unique identifier of the song
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Song'
 *    responses:
 *      200:
 *        description: Song deleted successfully
 *       content:
 *        application/json:
 *           schema:
 *             $ref: '#/components/schemas/Song'
 *       404:
 *         description: Song not found
 *       403:
 *         description: Not authorized to delete this song
 */
router.delete(
    "/:id",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    validateRequest(songSchemas.delete), 
    songController.deleteSong
);

export default router;
