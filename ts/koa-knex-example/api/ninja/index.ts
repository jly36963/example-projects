import {pick} from 'lodash-es';
import {Providers} from '../../dal/providers';
import Router from '@koa/router';

const createRouter = (providers: Providers): Router => {
  const {pgdal} = providers;
  const router = new Router();

  /** Get ninja by id */
  router.get('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      const ninja = await pgdal.ninjas.get(id);
      if (!ninja) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Insert new ninja */
  router.post('/', async ctx => {
    const ninjaNew = pick(ctx.request.body, ['firstName', 'lastName', 'age']);
    try {
      const ninja = await pgdal.ninjas.insert(ninjaNew);
      if (!ninja) throw new Error();
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Update ninja */
  router.put('/:id', async ctx => {
    const {id} = ctx.params;
    const ninjaUpdates = pick(ctx.request.body, [
      'firstName',
      'lastName',
      'age',
    ]);
    try {
      const ninja = await pgdal.ninjas.update(id, ninjaUpdates);
      if (!ninja) throw new Error();
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Delete ninja */
  router.delete('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      const ninja = await pgdal.ninjas.del(id);
      if (!ninja) throw new Error();
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Associate ninja & jutsu */
  router.post('/:ninjaId/jutsu/:jutsuId', async ctx => {
    const {ninjaId, jutsuId} = ctx.params;
    try {
      await pgdal.ninjas.associateJutsu(ninjaId, jutsuId);
      ctx.status = 204;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Disassociate ninja & jutsu */
  router.delete('/:ninjaId/jutsu/:jutsuId', async ctx => {
    const {ninjaId, jutsuId} = ctx.params;
    try {
      await pgdal.ninjas.disassociateJutsu(ninjaId, jutsuId);
      ctx.status = 204;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Get ninja with jutsus */
  router.get('/:id/jutsus', async ctx => {
    const {id} = ctx.params;
    try {
      const ninjaWithJutsus = await pgdal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutsus) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = ninjaWithJutsus;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  return router;
};

export default createRouter;
