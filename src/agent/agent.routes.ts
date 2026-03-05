import { Router } from 'express';
import { processUserMessage } from './agent.controller';

const router = Router();

router.post('/', processUserMessage);

export default router;
