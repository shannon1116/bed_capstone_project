import express, { Router } from "express";
import * as songController from "../controllers/songController";

const router: Router = express.Router();

// "/api/v1/songs" prefixes all below routes
router.post("/", songController.createSong);
router.get("/", songController.getAllSongs);
router.get("/:id", songController.getOneSong);
router.put("/:id", songController.updateSong);
router.delete("/:id", songController.deleteSong);

export default router;