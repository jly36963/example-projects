import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import { pick } from 'lodash-es';
import { Providers } from '../../dal/providers';
import { Ninja } from '../../types';

const createPlugin =
  (providers: Providers): FastifyPluginCallback =>
  async (app: FastifyInstance, options: FastifyPluginOptions) => {
    const { pgdal } = providers;

    // Get ninja by id
    app.get<{ Params: { id: string } }>('/:id', async (request, reply) => {
      const { id } = request.params;
      if (typeof id !== 'string') {
        return reply.status(400).send({});
      }
      try {
        const ninja = await pgdal.ninjas.get(id);
        if (!ninja) {
          return reply.status(404).send({});
        }
        return reply.status(200).send(ninja);
      } catch {
        return reply.status(500).send({});
      }
    });

    // Insert new ninja
    app.post<{ Body: Pick<Ninja, 'firstName' | 'lastName' | 'age'> }>(
      '/',
      async (request, reply) => {
        const ninjaNew = pick(request.body, ['firstName', 'lastName', 'age']);
        try {
          const ninja = await pgdal.ninjas.insert(ninjaNew);
          if (!ninja) throw new Error();
          return reply.status(200).send(ninja);
        } catch {
          return reply.status(500).send({});
        }
      },
    );

    // update
    app.put<{ Params: { id: string } }>('/:id', async (request, reply) => {
      const { id } = request.params;
      const ninjaUpdates = pick(request.body, ['firstName', 'lastName', 'age']);
      if (typeof id !== 'string') {
        return reply.status(400).send({});
      }
      try {
        const ninja = await pgdal.ninjas.update(id, ninjaUpdates);
        if (!ninja) throw new Error();
        return reply.status(200).send(ninja);
      } catch {
        return reply.status(500).send({});
      }
    });

    // delete
    app.delete<{ Params: { id: string } }>('/:id', async (request, reply) => {
      const { id } = request.params;
      if (typeof id !== 'string') {
        return reply.status(400).send({});
      }
      try {
        const ninja = await pgdal.ninjas.del(id);
        if (!ninja) throw new Error();
        return reply.status(200).send(ninja);
      } catch {
        return reply.status(500).send({});
      }
    });

    // associate ninja & jutsu
    app.post<{ Params: { ninjaId: string; jutsuId: string } }>(
      '/:ninjaId/jutsu/:jutsuId',
      async (request, reply) => {
        const { ninjaId, jutsuId } = request.params;
        if (typeof ninjaId !== 'string' || typeof jutsuId !== 'string') {
          return reply.status(400).send({});
        }
        try {
          await pgdal.ninjas.associateJutsu(ninjaId, jutsuId);
          return reply.status(204).send({});
        } catch {
          return reply.status(500).send({});
        }
      },
    );

    // disassociate ninja & jutsu
    app.delete<{ Params: { ninjaId: string; jutsuId: string } }>(
      '/:ninjaId/jutsu/:jutsuId',
      async (request, reply) => {
        const { ninjaId, jutsuId } = request.params;
        if (typeof ninjaId !== 'string' || typeof jutsuId !== 'string') {
          return reply.status(400).send({});
        }
        try {
          await pgdal.ninjas.disassociateJutsu(ninjaId, jutsuId);
          return reply.status(204).send({});
        } catch {
          return reply.status(500).send({});
        }
      },
    );

    // get ninja with jutsus
    app.get<{ Params: { id: string } }>(
      '/:id/jutsus',
      async (request, reply) => {
        const { id } = request.params;
        if (typeof id !== 'string') {
          return reply.status(400).send({});
        }
        try {
          const ninjaWithJutus = await pgdal.ninjas.getNinjaWithJutsus(id);
          if (!ninjaWithJutus) {
            return reply.status(404).send({});
          }
          return reply.status(200).send(ninjaWithJutus);
        } catch {
          return reply.status(500).send({});
        }
      },
    );
  };

export default createPlugin;
