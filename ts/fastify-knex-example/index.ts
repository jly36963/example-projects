import fastify from 'fastify';
import pino from 'pino';
import {getProviders} from './providers/index.js';
import type {routerFactory, ServerConfig} from './types/index.js';

export async function startServer({nodeEnv, port, pgUrl}: ServerConfig) {
  const dev = nodeEnv !== 'production';
  const pinoConfig = dev ? {transport: {target: 'pino-pretty'}} : {};

  const app = fastify({logger: pino(pinoConfig)});
  const providers = getProviders({pgUrl});

  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const fp = `.${p}/index.js`;
    const createRouter: routerFactory = (await import(fp)).default;
    const router = createRouter(providers);
    app.register(router, {prefix: p});
  }

  await app.listen({port});
  app.log.info(`server listening on ${port}`);
}
