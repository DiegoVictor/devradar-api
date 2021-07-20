import { Router } from 'express';

import SearchController from '../app/controllers/SearchController';
import SearchParamsValidator from '../app/validators/SearchParamsValidator';

const searchController = new SearchController();

const app = Router();

app.get('/search', SearchParamsValidator, searchController.index);

export default app;
