import 'dotenv/config';
import 'express-async-errors';

import Express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { isBoom } from '@hapi/boom';
import { errors } from 'celebrate';
import http from 'http';

import './database/mongodb';
import routes from './routes';
import { setupWebSocket } from './websocket';

const App = Express();
const Server = http.Server(App);

setupWebSocket(Server);

App.use(helmet());
App.use(cors());
App.use(Express.json());

if (process.env.NODE_ENV !== 'test') {
  App.use(
    new RateLimit({
      max: 100,
      windowMs: 1000 * 60 * 15,
      store: new RedisStore({
        client: redis.createClient({
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
        }),
      }),
    })
  );
}

App.use(routes);

App.use(errors());
App.use((err, _, res, next) => {
  if (isBoom(err)) {
    const { statusCode, payload } = err.output;

    return res.status(statusCode).json({
      ...payload,
      ...err.data,
      docs: process.env.DOCS_URL,
    });
  }

  return next(err);
});

export default Server;
