import { Router } from "express";
import {
  processUserMessage,
} from "../controllers/agent.controller";

const router = Router();

router.post("/", processUserMessage);

export default router;
