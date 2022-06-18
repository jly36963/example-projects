import { pick, Router } from "../../deps.ts";
import { CreateRouter, JutsuNew, JutsuUpdates } from "../../types/mod.ts";

const createRouter: CreateRouter = (providers) => {
  const { pgdal } = providers;

  const router = Router();

  /** Get jutsu by id */
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.sendStatus(400);
      return;
    }
    try {
      const jutsu = await pgdal.jutsus.get(id);
      if (!jutsu) {
        res.sendStatus(404);
        return;
      }
      res.json(jutsu);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Insert new jutsu */
  router.post("/", async (req, res) => {
    const jutsuNew: JutsuNew = pick(req.body, [
      "name",
      "description",
      "chakraNature",
    ]);
    try {
      const jutsu = await pgdal.jutsus.insert(jutsuNew);
      if (!jutsu) throw new Error();
      res.json(jutsu);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Update existing jutsu */
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.sendStatus(400);
      return;
    }
    const jutsuUpdates: JutsuUpdates = pick(req.body, [
      "name",
      "description",
      "chakraNature",
    ]);

    try {
      const jutsu = await pgdal.jutsus.update(id, jutsuUpdates);
      if (!jutsu) throw new Error();
      res.json(jutsu);
    } catch {
      res.sendStatus(500);
    }
  });

  /** Delete existing jutsu */
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    if (typeof id !== "string") {
      res.sendStatus(400);
      return;
    }
    try {
      const jutsu = await pgdal.jutsus.del(id);
      if (!jutsu) throw new Error();
      res.json(jutsu);
    } catch {
      res.sendStatus(500);
    }
  });

  return router;
};

export default createRouter;
