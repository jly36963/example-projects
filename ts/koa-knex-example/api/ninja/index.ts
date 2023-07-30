import {ZodError} from 'zod';
import Router from '@koa/router';
import {checkUuid} from '../../utils/index.js';
import {NinjaInputSchema, NinjaUpdatesSchema} from '../../types/index.js';
import type {routerFactory} from '../../types/index.js';

const createRouter: routerFactory = providers => {
  const {pgDal} = providers;
  const router = new Router();

  /** Get ninja by id */
  router.get('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.get(id);
      if (!ninja) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Insert new ninja */
  router.post('/', async ctx => {
    const ninjaInput = ctx.request.body;
    try {
      const parsedNinjaInput = NinjaInputSchema.parse(ninjaInput);
      const ninja = await pgDal.ninjas.insert(parsedNinjaInput);
      if (!ninja) throw new Error();
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Update ninja */
  router.put('/:id', async ctx => {
    const {id} = ctx.params;
    const ninjaUpdates = ctx.request.body;

    try {
      checkUuid(id);
      const parsedNinjaUpdates = NinjaUpdatesSchema.parse(ninjaUpdates);
      const ninja = await pgDal.ninjas.update(id, parsedNinjaUpdates);
      if (!ninja) {
        throw new Error();
      }
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Delete ninja */
  router.delete('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      checkUuid(id);
      const ninja = await pgDal.ninjas.del(id);
      if (!ninja) {
        throw new Error();
      }
      ctx.status = 200;
      ctx.body = ninja;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Associate ninja & jutsu */
  router.post('/:ninjaId/jutsu/:jutsuId', async ctx => {
    const {ninjaId, jutsuId} = ctx.params;
    try {
      checkUuid(ninjaId);
      checkUuid(jutsuId);
      await pgDal.ninjas.associateJutsu(ninjaId, jutsuId);
      ctx.status = 204;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Disassociate ninja & jutsu */
  router.delete('/:ninjaId/jutsu/:jutsuId', async ctx => {
    const {ninjaId, jutsuId} = ctx.params;
    try {
      await pgDal.ninjas.disassociateJutsu(ninjaId, jutsuId);
      ctx.status = 204;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  /** Get ninja with jutsus */
  router.get('/:id/jutsus', async ctx => {
    const {id} = ctx.params;
    try {
      checkUuid(id);
      const ninjaWithJutsus = await pgDal.ninjas.getNinjaWithJutsus(id);
      if (!ninjaWithJutsus) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = ninjaWithJutsus;
      return;
    } catch (err) {
      console.log(err);
      if (err instanceof ZodError) {
        ctx.status = 400;
        return;
      }
      ctx.status = 500;
      return;
    }
  });

  return router;
};

export default createRouter;
