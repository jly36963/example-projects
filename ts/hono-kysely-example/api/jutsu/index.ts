import { ZodError } from "zod";
import { Hono } from "hono";
import { checkUuid } from "../../utils/index.js";
import { JutsuInputSchema, JutsuUpdatesSchema } from "../../types/index.js";
import type { routerFactory } from "../../types/index.js";

const createRouter: routerFactory = (providers) => {
	const { pgDal } = providers;
	const router = new Hono();

	/** Get jutsu by id */
	router.get("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		try {
			checkUuid(id);
			const jutsu = await pgDal.jutsus.get(id);
			if (!jutsu) {
				return ctx.body(undefined, 404);
			}
			return ctx.json(jutsu);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Insert new jutsu */
	router.post("/", async (ctx) => {
		const input = await ctx.req.json();

		try {
			const jutsuInput = JutsuInputSchema.parse(input);
			const jutsu = await pgDal.jutsus.insert(jutsuInput);
			if (!jutsu) throw new Error();
			return ctx.json(jutsu);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Update jutsu */
	router.put("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		const jutsuInput = await ctx.req.json();
		try {
			checkUuid(id);
			const existingJutsu = await pgDal.jutsus.get(id);
			if (!existingJutsu) {
				return ctx.body(undefined, 404);
			}
			const parsedJutsuInput = JutsuUpdatesSchema.parse(jutsuInput);
			const jutsu = await pgDal.jutsus.update(id, parsedJutsuInput);
			return ctx.json(jutsu);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	/** Delete jutsu */
	router.delete("/:id", async (ctx) => {
		const { id } = ctx.req.param();
		try {
			checkUuid(id);
			const existingJutsu = await pgDal.jutsus.get(id);
			if (!existingJutsu) {
				return ctx.body(undefined, 404);
			}
			const jutsu = await pgDal.jutsus.del(id);
			return ctx.json(jutsu);
		} catch (err) {
			if (err instanceof ZodError) {
				return ctx.body(undefined, 400);
			}
			console.log(err);
			return ctx.body(undefined, 500);
		}
	});

	return router;
};

export default createRouter;
