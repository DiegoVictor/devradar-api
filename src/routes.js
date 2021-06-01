import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SessionController from './app/controllers/SessionController';
import SearchController from './app/controllers/SearchController';
import BearerAuth from './app/middlewares/BearerAuth';
import IdValidator from './app/validators/IdValidator';
import SearchParamsValidator from './app/validators/SearchParamsValidator';
import PageValidator from './app/validators/PageValidator';
import DeveloperValidator from './app/validators/DeveloperValidator';

const sessionController = new SessionController();
const developerController = new DeveloperController();
const searchController = new SearchController();

const Route = Router();

Route.post('/sessions', SessionController.store);

Route.get('/developers', PageValidator, DeveloperController.index);
Route.get('/developers/:id', IdValidator, DeveloperController.show);
Route.post('/developers', DeveloperValidator.store, DeveloperController.store);

Route.get('/search', SearchParamsValidator, SearchController.index);

Route.use(BearerAuth);

Route.put('/developers', DeveloperValidator.update, DeveloperController.update);
Route.delete('/developers', DeveloperController.destroy);

export default Route;
