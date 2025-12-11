import {ZodError} from 'zod';
import {checkUuid} from '../../utils/index.js';
import {JutsuInputSchema, JutsuUpdatesSchema} from '../../types/index.js';

import type {routerFactory} from '../../types/index.js';

const createPlugin: routerFactory = providers => async (app, options) => {
  const {pgDal} = providers;

  /** Get jutsu by id */
  app.get<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    try {
      checkUuid(id);
      const jutsu = await pgDal.jutsus.get(id);
      if (!jutsu) {
        return reply.status(404).send({});
      }
      return reply.status(200).send(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Insert new jutsu */
  app.post('/', async (request, reply) => {
    const jutsuInput = request.body;
    try {
      const parsedJutsuInput = JutsuInputSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.insert(parsedJutsuInput);
      if (!jutsu) throw new Error();
      return reply.status(200).send(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Update jutsu */
  app.put<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    const jutsuInput = request.body;
    try {
      checkUuid(id);
      const parsedJutsuInput = JutsuUpdatesSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.update(id, parsedJutsuInput);
      if (!jutsu) throw new Error();
      return reply.status(200).send(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Delete jutsu */
  app.delete<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    try {
      checkUuid(id);
      const jutsu = await pgDal.jutsus.del(id);
      if (!jutsu) throw new Error();
      return reply.status(200).send(jutsu);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  return app;
};

export default createPlugin;
