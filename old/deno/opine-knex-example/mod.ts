import { json, opine, posix } from "./deps.ts";
import addLogger from "./middleware/logger.ts";
import { providers } from "./dal/providers.ts";
import { CreateRouter } from "./types/mod.ts";

const main = async () => {
  const app = opine();
  app.use(json());
  addLogger(app);

  // Add routers
  const cwd = Deno.cwd();
  const routerPaths = [
    "/api/ninja",
    "/api/jutsu",
  ];

  console.log("Adding routers:");
  for (const path of routerPaths) {
    const filepath = posix.join(cwd, path, "mod.ts");
    const { default: cr }: { default: CreateRouter } = await import(filepath);
    const router = cr(providers);
    console.log(path);
    app.use(path, router);
  }

  // Start app
  const port = parseInt(Deno.env.get("PORT") ?? "5000");
  app.listen(port, () => console.log(`Starting server on port ${port}`));
};

main();
