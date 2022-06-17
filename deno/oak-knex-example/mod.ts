import { oak, posix } from "./deps.ts";
import addLogger from "./middleware/logger.ts";
import { providers } from "./dal/providers.ts";
import { getHttpsOptions } from "./tls/helpers.ts";
import { CreateRouter } from "./types/mod.ts";

const main = async () => {
  const app = new oak.Application();
  addLogger(app);

  // Add routers
  const cwd = Deno.cwd();
  const routerPaths = [
    posix.join(cwd, "api/ninja/mod.ts"),
    posix.join(cwd, "api/jutsu/mod.ts"),
  ];

  for (const path of routerPaths) {
    const { default: cr }: { default: CreateRouter } = await import(path);
    const router = cr(providers);
    app.use(router.routes()).use(router.allowedMethods());
  }

  // Start app
  const port = parseInt(Deno.env.get("PORT") ?? "5000");

  app.addEventListener("listen", ({ hostname, port }) => {
    console.log(`Starting server at ${hostname}:${port}`);
  });

  await app.listen({
    port,
    ...getHttpsOptions(false),
  });
};

main();
