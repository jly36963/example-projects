import {
  FastifyInstance,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify';
import {pick} from 'lodash-es';
import {Providers} from '../../dal/providers';
import {Jutsu} from '../../types';

const createPlugin =
  (providers: Providers): FastifyPluginCallback =>
  async (app: FastifyInstance, options: FastifyPluginOptions) => {
    const {pgdal} = providers;

    /** Get jutsu by id */
    app.get<{Params: {id: string}}>('/:id', async (request, reply) => {
      const {id} = request.params;
      try {
        const jutsu = await pgdal.jutsus.get(id);
        if (!jutsu) {
          return reply.status(404).send({});
        }
        return reply.status(200).send(jutsu);
      } catch {
        return reply.status(500).send({});
      }
    });

    /** Insert new jutsu */
    app.post<{Body: Pick<Jutsu, 'name' | 'chakraNature' | 'description'>}>(
      '/',
      async (request, reply) => {
        const jutsuNew = pick(request.body, [
          'name',
          'description',
          'chakraNature',
        ]);
        try {
          const jutsu = await pgdal.jutsus.insert(jutsuNew);
          if (!jutsu) throw new Error();
          return reply.status(200).send(jutsu);
        } catch {
          return reply.status(500).send({});
        }
      }
    );

    /** Update jutsu */
    app.put<{Params: {id: string}}>('/:id', async (request, reply) => {
      const {id} = request.params;
      const jutsuUpdates = pick(request.body, [
        'name',
        'description',
        'chakraNature',
      ]);
      try {
        const jutsu = await pgdal.jutsus.update(id, jutsuUpdates);
        if (!jutsu) throw new Error();
        return reply.status(200).send(jutsu);
      } catch {
        return reply.status(500).send({});
      }
    });

    /** Delete jutsu */
    app.delete<{Params: {id: string}}>('/:id', async (request, reply) => {
      const {id} = request.params;
      try {
        const jutsu = await pgdal.jutsus.del(id);
        if (!jutsu) throw new Error();
        return reply.status(200).send(jutsu);
      } catch {
        return reply.status(500).send({});
      }
    });

    return app;
  };

export default createPlugin;
