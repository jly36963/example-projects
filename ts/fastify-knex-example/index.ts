import dotenv from 'dotenv';
dotenv.config();

import fastify, {FastifyPluginCallback} from 'fastify';
import pino from 'pino';
import {providers, Providers} from './dal/providers';

const main = async () => {
  // instantiate app
  const app = fastify({
    logger: pino({transport: {target: 'pino-pretty'}}),
  });
  const paths = ['/api/ninja', '/api/jutsu'];
  for (const p of paths) {
    const createPlugin: (providers: Providers) => FastifyPluginCallback = (
      await import(`.${p}`)
    ).default;
    const plugin = createPlugin(providers);
    app.register(plugin, {prefix: p});
  }

  // const port: string | number = process.env.PORT || 5000;
  // await app.listen(port, (): void =>
  //   console.log(`App listening at http://localhost:${port}`),
  // );
  try {
    const port: string | number = process.env.PORT || 5000;
    await app.listen(port);
    app.log.info(`server listening on ${port}`);
  } catch (err: any) {
    app.log.error(err.message);
    throw err;
  }
};

main();
