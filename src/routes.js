import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SearchController from './app/controllers/SearchController';

import IdValidator from './app/validators/IdValidator';
import SearchParamsValidator from './app/validators/SearchParamsValidator';
import DeveloperValidator from './app/validators/DeveloperValidator';

const Route = Router();

Route.get('/developers', DeveloperController.index);
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
