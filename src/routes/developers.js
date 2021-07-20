import { Router } from 'express';

import DeveloperController from '../app/controllers/DeveloperController';
import bearerAuth from '../app/middlewares/bearerAuth';
import IdValidator from '../app/validators/IdValidator';
import PageValidator from '../app/validators/PageValidator';
import DeveloperValidator from '../app/validators/DeveloperValidator';

const developerController = new DeveloperController();

const app = Router();

app.get('/', PageValidator, developerController.index);
app.get('/:id', IdValidator, developerController.show);
app.post('/', DeveloperValidator.store, developerController.store);

app.use(bearerAuth);

app.put('/', DeveloperValidator.update, developerController.update);
app.delete('/', developerController.destroy);

export default app;
