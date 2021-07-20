import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SessionController from './app/controllers/SessionController';
import SearchController from './app/controllers/SearchController';
import bearerAuth from './app/middlewares/bearerAuth';
import IdValidator from './app/validators/IdValidator';
import SearchParamsValidator from './app/validators/SearchParamsValidator';
import PageValidator from './app/validators/PageValidator';
import DeveloperValidator from './app/validators/DeveloperValidator';

const sessionController = new SessionController();
const developerController = new DeveloperController();
const searchController = new SearchController();

const app = Router();

app.post('/sessions', sessionController.store);

app.get('/developers', PageValidator, developerController.index);
app.get('/developers/:id', IdValidator, developerController.show);
app.post('/developers', DeveloperValidator.store, developerController.store);

app.get('/search', SearchParamsValidator, searchController.index);

app.use(bearerAuth);

app.put('/developers', DeveloperValidator.update, developerController.update);
app.delete('/developers', developerController.destroy);

export default app;
