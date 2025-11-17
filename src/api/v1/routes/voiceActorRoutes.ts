import express, { Router } from "express";
import * as voiceActorController from "../controllers/voiceActorController";

const router: Router = express.Router();

// "/api/v1/voiceActors" prefixes all below routes
router.post("/", voiceActorController.createVoiceActor);
router.get("/", voiceActorController.getAllVoiceActors);
router.get("/:id", voiceActorController.getOneVoiceActor);
router.put("/:id", voiceActorController.updateVoiceActor);
router.delete("/:id", voiceActorController.deleteVoiceActor);

export default router;