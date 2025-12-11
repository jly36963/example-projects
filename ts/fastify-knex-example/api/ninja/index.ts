import {ZodError} from 'zod';
import {checkUuid} from '../../utils/index.js';
import {NinjaInputSchema, NinjaUpdatesSchema} from '../../types/index.js';

import type {routerFactory} from '../../types/index.js';

const createPlugin: routerFactory = providers => async (app, _options) => {
  const {pgDal} = providers;

  /** Get ninja by id */
  app.get<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.get(id);
      if (!ninja) {
        return reply.status(404).send({});
      }
      return reply.status(200).send(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Insert new ninja */
  app.post('/', async (request, reply) => {
    const ninjaInput = request.body;
    try {
      const parsedNinjaInput = NinjaInputSchema.parse(ninjaInput);
      const ninja = await pgDal.ninjas.insert(parsedNinjaInput);
      if (!ninja) throw new Error();
      return reply.status(200).send(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Update ninja */
  app.put<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    const ninjaUpdates = request.body;
    try {
      checkUuid(id);
      const parsedNinjaUpdates = NinjaUpdatesSchema.parse(ninjaUpdates);
      const ninja = await pgDal.ninjas.update(id, parsedNinjaUpdates);
      if (!ninja) throw new Error();
      return reply.status(200).send(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Delete ninja */
  app.delete<{Params: {id: string}}>('/:id', async (request, reply) => {
    const {id} = request.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.del(id);
      if (!ninja) throw new Error();
      return reply.status(200).send(ninja);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });

  /** Associate ninja & jutsu */
  app.post<{Params: {ninjaId: string; jutsuId: string}}>(
    '/:ninjaId/jutsu/:jutsuId',
    async (request, reply) => {
      const {ninjaId, jutsuId} = request.params;
      try {
        checkUuid(ninjaId);
        checkUuid(jutsuId);
        await pgDal.ninjas.associateJutsu(ninjaId, jutsuId);
        return reply.status(204).send({});
      } catch (err) {
        console.log(err);
        if (err instanceof ZodError) {
          return reply.status(400).send({});
        }
        return reply.status(500).send({});
      }
    }
  );

  /** Disassociate ninja & jutsu */
  app.delete<{Params: {ninjaId: string; jutsuId: string}}>(
    '/:ninjaId/jutsu/:jutsuId',
    async (request, reply) => {
      const {ninjaId, jutsuId} = request.params;
      try {
        checkUuid(ninjaId);
        checkUuid(jutsuId);
        await pgDal.ninjas.disassociateJutsu(ninjaId, jutsuId);
        return reply.status(204).send({});
      } catch (err) {
        console.log(err);
        if (err instanceof ZodError) {
          return reply.status(400).send({});
        }
        return reply.status(500).send({});
      }
    }
  );

  /** Get ninja with jutsus */
  app.get<{Params: {id: string}}>('/:id/jutsus', async (request, reply) => {
    const {id} = request.params;
    try {
      checkUuid(id);
      const ninjaWithJutus = await pgDal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutus) {
        return reply.status(404).send({});
      }
      return reply.status(200).send(ninjaWithJutus);
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        return reply.status(400).send({});
      }
      return reply.status(500).send({});
    }
  });
};

export default createPlugin;
