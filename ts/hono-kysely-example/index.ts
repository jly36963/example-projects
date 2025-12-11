import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { getProviders } from "./providers/index.js";
import type { ServerConfig, routerFactory } from "./types/index.js";

export async function startServer(serverConfig: ServerConfig): Promise<void> {
	const { nodeEnv, port, pgUrl } = serverConfig;
	const app = new Hono();
	app.use(logger());
	const providers = getProviders({ pgUrl });

	const paths = ["/api/ninja", "/api/jutsu"];
	for (const p of paths) {
		const fp = `.${p}/index.js`;
		const createRouter: routerFactory = (await import(fp)).default;
		const router = createRouter(providers);
		app.route(p, router);
	}

	console.log(`App listening on port ${port}.`);
	serve({
		fetch: app.fetch,
		port,
		// Response object is messed up without this
		overrideGlobalObjects: false,
	});
}
