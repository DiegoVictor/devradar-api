import { Router } from 'express';

import SessionController from '../app/controllers/SessionController';

const app = Router();
const sessionController = new SessionController();

app.post('/', sessionController.store);

export default app;
