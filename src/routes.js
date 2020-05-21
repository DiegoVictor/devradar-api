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
import SessionController from './app/controllers/SessionController';

const Route = Router();

Route.post(
  '/sessions',
  new BruteForce(config).prevent,
  SessionController.store
);

Route.use(RateLimit);

Route.get('/developers', PageValidator, DeveloperController.index);
Route.get('/developers/:id', IdValidator, DeveloperController.show);
Route.post('/developers', DeveloperValidator.store, DeveloperController.store);

Route.get('/search', SearchParamsValidator, SearchController.index);

Route.use(BearerAuth);

Route.put('/developers', DeveloperValidator.update, DeveloperController.update);
Route.delete('/developers', DeveloperController.destroy);

export default Route;
