import { mapKeys, camelCase } from "lodash-es";
import {startServer} from "../index.js";
import { ServerConfigSchema } from "../types/index.js";

async function main() {
  const env = mapKeys(process.env, (v, k) => camelCase(k));
  const config = ServerConfigSchema.parse(env);
  await startServer(config);
}

main();
