import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SearchController from './app/controllers/SearchController';

import IdValidator from './app/validators/IdValidator';
import SearchParamsValidator from './app/validators/SearchParamsValidator';
import DeveloperValidator from './app/validators/DeveloperValidator';

import RateLimit from './app/middlewares/RateLimit';

const Route = Router();

Route.use(RateLimit);

Route.get('/developers', DeveloperController.index);
Route.get('/developers/:id', IdValidator, DeveloperController.show);
Route.post('/developers', DeveloperValidator, DeveloperController.store);
Route.put(
  '/developers/:id',
  IdValidator,
  DeveloperValidator,
  DeveloperController.update
);
Route.delete('/developers/:id', IdValidator, DeveloperController.destroy);

Route.get('/search', SearchParamsValidator, SearchController.index);

export default Route;
