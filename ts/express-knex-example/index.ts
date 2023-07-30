import express from 'express';
import pino from 'express-pino-logger';
import {getProviders} from './providers/index.js';
import type {routerFactory, ServerConfig} from './types/index.js';

export async function startServer({nodeEnv, port, pgUrl}: ServerConfig) {
  const dev = nodeEnv !== 'production';
  const pinoConfig = dev ? {transport: {target: 'pino-pretty'}} : {};

  const app = express().use(express.json()).use(pino(pinoConfig));
  const providers = getProviders({pgUrl});

  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const fp = `.${p}/index.js`;
    const createRouter: routerFactory = (await import(fp)).default;
    const router = createRouter(providers);
    app.use(p, router);
  }

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
}
