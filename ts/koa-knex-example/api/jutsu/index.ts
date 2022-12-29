import Router from '@koa/router';
import {pick} from 'lodash-es';
import {Providers} from '../../dal/providers';

const createRouter = (providers: Providers): Router => {
  const {pgdal} = providers;
  const router = new Router();

  /** Get jutsu by id */
  router.get('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      const jutsu = await pgdal.jutsus.get(id);
      if (!jutsu) {
        ctx.status = 404;
        return;
      }
      ctx.status = 200;
      ctx.body = jutsu;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Insert new jutsu */
  router.post('/', async ctx => {
    const jutsuNew = pick(ctx.request.body, [
      'name',
      'description',
      'chakraNature',
    ]);
    try {
      const jutsu = await pgdal.jutsus.insert(jutsuNew);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Update jutsu */
  router.put('/:id', async ctx => {
    const {id} = ctx.params;
    const jutsuUpdates = pick(ctx.request.body, [
      'name',
      'description',
      'chakraNature',
    ]);
    try {
      const jutsu = await pgdal.jutsus.update(id, jutsuUpdates);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
      return;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  /** Delete jutsu */
  router.delete('/:id', async ctx => {
    const {id} = ctx.params;
    try {
      const jutsu = await pgdal.jutsus.del(id);
      if (!jutsu) throw new Error();
      ctx.status = 200;
      ctx.body = jutsu;
    } catch {
      ctx.status = 500;
      return;
    }
  });

  return router;
};

export default createRouter;
