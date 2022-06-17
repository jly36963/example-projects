import { oak, pick } from "../../deps.ts";
import { CreateRouter, JutsuNew, JutsuUpdates } from "../../types/mod.ts";

const createRouter: CreateRouter = (providers) => {
  const { pgdal } = providers;

  const router = new oak.Router({ prefix: "/api/jutsu" });

  /** Get jutsu by id */
  router.get("/:id", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      const jutsu = await pgdal.jutsus.get(id);
      if (!jutsu) {
        c.response.status = 404;
        return;
      }
      c.response.status = 200;
      c.response.body = jutsu;
    } catch {
      c.response.status = 500;
    }
  });

  /** Insert new jutsu */
  router.post("/", async (c) => {
    const body = c.request.body();
    if (body.type !== "json") {
      c.response.status = 400;
      return;
    }
    const jutsuNew: JutsuNew = pick(await body.value, [
      "name",
      "description",
      "chakraNature",
    ]);
    try {
      const jutsu = await pgdal.jutsus.insert(jutsuNew);
      if (!jutsu) throw new Error();
      c.response.status = 200;
      c.response.body = jutsu;
    } catch {
      c.response.status = 500;
    }
  });

  /** Update existing jutsu */
  router.put("/:id", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }

    const body = c.request.body();
    if (body.type !== "json") {
      c.response.status = 400;
      return;
    }
    const jutsuUpdates: JutsuUpdates = pick(await body.value, [
      "name",
      "description",
      "chakraNature",
    ]);

    try {
      const jutsu = await pgdal.jutsus.update(id, jutsuUpdates);
      if (!jutsu) throw new Error();
      c.response.status = 200;
      c.response.body = jutsu;
    } catch {
      c.response.status = 500;
    }
  });

  /** Delete existing jutsu */
  router.delete("/:id", async (c) => {
    const { id } = c.params;
    if (typeof id !== "string") {
      c.response.status = 400;
      return;
    }
    try {
      const jutsu = await pgdal.jutsus.del(id);
      if (!jutsu) throw new Error();
      c.response.status = 200;
      c.response.body = jutsu;
    } catch {
      c.response.status = 500;
    }
  });

  return router;
};

export default createRouter;
