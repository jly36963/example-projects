import {ZodError} from 'zod';
import Router from '@koa/router';
import {checkUuid} from '../../utils/index.js';
import {JutsuInputSchema, JutsuUpdatesSchema} from '../../types/index.js';
import type {routerFactory} from '../../types/index.js';

const createRouter: routerFactory = providers => {
  const {pgDal} = providers;
  const router = new Router();

  /** Get jutsu by id */
  router.get('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      checkUuid(id);
      const jutsu = await pgDal.jutsus.get(id);
      if (!jutsu) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = jutsu;
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

  /** Insert new jutsu */
  router.post('/', async ctx => {
    const jutsuInput = ctx.request.body;

    try {
      const parsedJutsuInput = JutsuInputSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.insert(parsedJutsuInput);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
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

  /** Update jutsu */
  router.put('/:id', async ctx => {
    const {id} = ctx.params;
    const jutsuInput = ctx.request.body;
    try {
      checkUuid(id);
      const parsedJutsuInput = JutsuUpdatesSchema.parse(jutsuInput);
      const jutsu = await pgDal.jutsus.update(id, parsedJutsuInput);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
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

  /** Delete jutsu */
  router.delete('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      checkUuid(id);
      const jutsu = await pgDal.jutsus.del(id);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
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
