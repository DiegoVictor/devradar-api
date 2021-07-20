import { Router } from 'express';

import developers from './developers';
import search from './search';
import sessions from './sessions';

const app = Router();

app.use('/sessions', sessions);
app.use('/developers', developers);

app.get('/search', search);

export default app;
