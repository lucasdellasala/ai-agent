import { Router } from "express";
import { logs } from "../data/mockDB";

const router = Router();

router.get("/", (_, res) => res.json(logs));

export default router;
