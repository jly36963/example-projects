import Koa from 'koa';
import pino from 'koa-pino-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import {getProviders} from './providers/index.js';
import type {routerFactory, ServerConfig} from './types/index.js';

export async function startServer({nodeEnv, port, pgUrl}: ServerConfig) {
  const dev = nodeEnv !== 'production';
  const pinoConfig = dev ? {transport: {target: 'pino-pretty'}} : {};

  const app = new Koa().use(json()).use(bodyParser()).use(pino(pinoConfig));

  const providers = getProviders({pgUrl});

  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const fp = `.${p}/index.js`;
    const createRouter: routerFactory = (await import(fp)).default;
    const router = createRouter(providers);
    router.prefix(p);
    app.use(router.routes()).use(router.allowedMethods());
  }

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
}
