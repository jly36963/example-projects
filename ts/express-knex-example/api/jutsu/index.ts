// imports
import express from 'express';
import {pick} from 'lodash-es';
import {Providers} from '../../dal/providers';

const createRouter = (providers: Providers): express.Router => {
  const {pgdal} = providers;

  const router = express.Router();

  /** Get jutsu by id */
  router.get('/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
      const jutsu = await pgdal.jutsus.get(id);
      if (!jutsu) {
        return res.sendStatus(404);
      }
      return res.status(200).json(jutsu);
    } catch {
      return res.sendStatus(500);
    }
  });

  /** Insert new jutsu */
  router.post('/', async (req: express.Request, res: express.Response) => {
    const jutsuNew = pick(req.body, ['name', 'description', 'chakraNature']);
    try {
      const jutsu = await pgdal.jutsus.insert(jutsuNew);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch {
      return res.sendStatus(500);
    }
  });

  /** Update jutsu */
  router.put('/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    const jutsuUpdates = pick(req.body, [
      'name',
      'description',
      'chakraNature',
    ]);
    try {
      const jutsu = await pgdal.jutsus.update(id, jutsuUpdates);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch {
      return res.sendStatus(500);
    }
  });

  /** Delete jutsu */
  router.delete('/:id', async (req: express.Request, res: express.Response) => {
    const {id} = req.params;
    try {
      const jutsu = await pgdal.jutsus.del(id);
      if (!jutsu) throw new Error();
      return res.status(200).json(jutsu);
    } catch {
      return res.sendStatus(500);
    }
  });

  return router;
};

export default createRouter;
