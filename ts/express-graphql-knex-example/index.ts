import express from 'express';
import pino from 'pino-http';
import {getProviders} from './providers/index.js';
import type {routerFactory, ServerConfig} from './types/index.js';
import {getGraphqlRouter} from './graphql/index.js';

export async function startServer({nodeEnv, port, pgUrl}: ServerConfig) {
  const dev = nodeEnv !== 'production';
  const pinoConfig = dev ? {transport: {target: 'pino-pretty'}} : {};

  const app = express().use(express.json()).use(pino(pinoConfig));
  const providers = getProviders({pgUrl});

  // Rest routers
  const paths = ['/api'];
  for (const p of paths) {
    const fp = `.${p}/index.js`;
    const createRouter: routerFactory = (await import(fp)).default;
    const router = createRouter(providers);
    app.use(p, router);
  }
  // Graphql router
  const graphqlRouter = await getGraphqlRouter(providers);
  app.use('/api/graphql', graphqlRouter);

  app.listen(port, () =>
    console.log(`App listening at http://localhost:${port}`)
  );
}

// graphiql does not work with helmet on
// https://github.com/contrawork/graphql-helix/issues/4
