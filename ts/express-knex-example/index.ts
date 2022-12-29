import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import pino from 'express-pino-logger';
import {providers, Providers} from './dal/providers';

const main = async () => {
  const app = express()
    .use(express.json())
    .use(pino({prettyPrint: true}));

  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const createRouter: (providers: Providers) => express.Router = (
      await import(`.${p}`)
    ).default;
    const router = createRouter(providers);
    app.use(p, router);
  }

  const port: string | number = process.env.PORT || 5000;
  app.listen(port, (): void =>
    console.log(`App listening at http://localhost:${port}`)
  );
};

main();
