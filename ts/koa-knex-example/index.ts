import dotenv from 'dotenv';
dotenv.config();

import Koa from 'koa';
import Router from '@koa/router';
import pino from 'koa-pino-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import { providers, Providers } from './dal/providers';

const main = async () => {
  const app = new Koa()
    .use(json())
    .use(bodyParser())
    .use(pino({ prettyPrint: true }));

  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const createRouter: (providers: Providers) => Router = (
      await import(`.${p}`)
    ).default;
    const router = createRouter(providers);
    router.prefix(p);
    app.use(router.routes()).use(router.allowedMethods());
  }

  const port: string | number = process.env.PORT || 5000;
  app.listen(port, (): void =>
    console.log(`App listening at http://localhost:${port}`),
  );
};

main();
