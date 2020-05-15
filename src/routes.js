import { Router } from 'express';

import DeveloperController from './app/controllers/DeveloperController';
import SearchController from './app/controllers/SearchController';

import IdValidator from './app/validators/IdValidator';
import SearchParamsValidator from './app/validators/SearchParamsValidator';
import DeveloperValidator from './app/validators/DeveloperValidator';
import PageValidator from './app/validators/PageValidator';

import RateLimit from './app/middlewares/RateLimit';
import BearerAuth from './app/middlewares/BearerAuth';

import { BruteForce } from './database/redis';
import config from './config/bruteforce';

const Route = Router();

Route.use(RateLimit);

Route.get('/developers', PageValidator, DeveloperController.index);
Route.get('/developers/:id', IdValidator, DeveloperController.show);
Route.post(
  '/developers',
  new BruteForce(config).prevent,
  DeveloperValidator,
  DeveloperController.store
);

Route.get('/search', SearchParamsValidator, SearchController.index);

Route.use(BearerAuth);

Route.put(
  '/developers/:id',
  IdValidator,
  DeveloperValidator,
  DeveloperController.update
);
Route.delete('/developers/:id', IdValidator, DeveloperController.destroy);

export default Route;
