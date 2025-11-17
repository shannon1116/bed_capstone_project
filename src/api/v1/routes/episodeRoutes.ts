import express, { Router } from "express";
import * as episodeController from "../controllers/episodeController";

const router: Router = express.Router();

// "/api/v1/episodes" prefixes all below routes
router.post("/", episodeController.createEpisode);
router.get("/", episodeController.getAllEpisodes);
router.get("/:id", episodeController.getOneEpisode);
router.put("/:id", episodeController.updateEpisode);
router.delete("/:id", episodeController.deleteEpisode);

export default router;